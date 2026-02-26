import jsPDF from 'jspdf';
import { RiskResult, QuestionAnswer } from '@/types/leishcheck';
import { questions } from '@/data/questions';

const MARGIN = 20;
const PAGE_W = 210;
const CONTENT_W = PAGE_W - MARGIN * 2;

const COLORS = {
  low: { band: [46, 125, 50], badgeBg: [232, 245, 233], badgeText: [27, 94, 32] },
  medium: { band: [245, 166, 35], badgeBg: [255, 248, 225], badgeText: [230, 81, 0] },
  high: { band: [211, 47, 47], badgeBg: [255, 235, 238], badgeText: [183, 28, 28] },
};

function drawFooter(doc: jsPDF, pageNum: number, totalPages: number) {
  const h = doc.internal.pageSize.getHeight();
  // Footer band
  doc.setFillColor(240, 240, 240);
  doc.rect(0, h - 18, PAGE_W, 18, 'F');
  doc.setFontSize(7);
  doc.setTextColor(130);
  doc.setFont('helvetica', 'normal');
  doc.text('leishcheck.app', MARGIN, h - 7);
  doc.text(`Página ${pageNum} de ${totalPages}`, PAGE_W - MARGIN, h - 7, { align: 'right' });
}

function drawDecoLine(doc: jsPDF) {
  const h = doc.internal.pageSize.getHeight();
  doc.setDrawColor(46, 125, 50);
  doc.setLineWidth(0.3);
  doc.line(12, 30, 12, h - 22);
}

function checkPage(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > doc.internal.pageSize.getHeight() - 25) {
    doc.addPage();
    drawDecoLine(doc);
    return 25;
  }
  return y;
}

function sectionTitle(doc: jsPDF, title: string, y: number, color: number[]): number {
  // Colored sidebar bar
  doc.setFillColor(color[0], color[1], color[2]);
  doc.rect(MARGIN, y - 4, 3, 8, 'F');
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(50, 50, 50);
  doc.text(title.toUpperCase(), MARGIN + 8, y + 2);
  return y + 12;
}

export function generateResultPDF(
  result: RiskResult,
  answers: QuestionAnswer[],
  userData?: { age?: number; gender?: string; city?: string; state?: string }
) {
  const doc = new jsPDF();
  const w = PAGE_W;
  const colors = COLORS[result.level] || COLORS.low;
  let y = 0;

  // ─── HEADER BAND ───
  doc.setFillColor(colors.band[0], colors.band[1], colors.band[2]);
  doc.rect(0, 0, w, 38, 'F');

  // Title on band
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('LEISHCHECK', MARGIN, 16);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Relatório de Triagem', MARGIN, 24);
  doc.setFontSize(9);
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, MARGIN, 33);

  y = 50;

  // Decorative vertical line
  drawDecoLine(doc);

  // ─── RESULT BADGE ───
  const badgeX = MARGIN;
  const badgeW = CONTENT_W;
  const badgeH = 30;

  doc.setFillColor(colors.badgeBg[0], colors.badgeBg[1], colors.badgeBg[2]);
  doc.roundedRect(badgeX, y, badgeW, badgeH, 4, 4, 'F');

  // Badge border
  doc.setDrawColor(colors.band[0], colors.band[1], colors.band[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(badgeX, y, badgeW, badgeH, 4, 4, 'S');

  // Badge text
  doc.setTextColor(colors.badgeText[0], colors.badgeText[1], colors.badgeText[2]);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`${result.percentage}% — ${result.title}`, w / 2, y + 12, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const descLines = doc.splitTextToSize(result.description, badgeW - 16);
  doc.text(descLines, w / 2, y + 20, { align: 'center' });

  y += badgeH + 10;

  // Orientation
  doc.setTextColor(80);
  doc.setFontSize(9);
  const orientLines = doc.splitTextToSize(result.orientation, CONTENT_W);
  doc.text(orientLines, MARGIN, y);
  y += orientLines.length * 4.5 + 8;

  // ─── DIVIDER ───
  doc.setDrawColor(220);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y, w - MARGIN, y);
  y += 10;

  // ─── PATIENT DATA ───
  if (userData && (userData.age || userData.gender || userData.city)) {
    y = checkPage(doc, y, 30);
    y = sectionTitle(doc, 'Dados do Paciente', y, colors.band);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60);

    const fields: string[] = [];
    if (userData.age) fields.push(`Idade: ${userData.age}`);
    if (userData.gender) fields.push(`Gênero: ${userData.gender}`);
    if (userData.city || userData.state) fields.push(`Local: ${[userData.city, userData.state].filter(Boolean).join(' — ')}`);

    doc.text(fields.join('   |   '), MARGIN + 8, y);
    y += 12;

    doc.setDrawColor(220);
    doc.line(MARGIN, y, w - MARGIN, y);
    y += 10;
  }

  // ─── QUESTIONNAIRE ANSWERS ───
  y = checkPage(doc, y, 20);
  y = sectionTitle(doc, 'Respostas do Questionário', y, colors.band);

  questions.forEach((q, i) => {
    y = checkPage(doc, y, 8);

    // Zebra striping
    if (i % 2 === 0) {
      doc.setFillColor(248, 248, 248);
      doc.rect(MARGIN, y - 4, CONTENT_W, 7, 'F');
    }

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60);

    const answer = answers.find((a) => a.questionIndex === i);
    const qText = `${i + 1}. ${q.text}`;
    doc.text(qText, MARGIN + 4, y, { maxWidth: CONTENT_W - 30 });

    // Answer badge
    if (answer) {
      const isYes = answer.answer;
      if (isYes) {
        doc.setFillColor(232, 245, 233);
        doc.setTextColor(27, 94, 32);
      } else {
        doc.setFillColor(255, 235, 238);
        doc.setTextColor(183, 28, 28);
      }
      const label = isYes ? 'Sim' : 'Não';
      const labelW = doc.getTextWidth(label) + 6;
      doc.roundedRect(w - MARGIN - labelW - 2, y - 3.5, labelW + 2, 5.5, 1.5, 1.5, 'F');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(label, w - MARGIN - labelW / 2 - 1, y + 0.5, { align: 'center' });
    } else {
      doc.setTextColor(160);
      doc.setFontSize(8);
      doc.text('—', w - MARGIN - 6, y);
    }

    y += 7;
  });

  y += 8;

  // ─── DISCLAIMER ───
  y = checkPage(doc, y, 30);
  doc.setDrawColor(220);
  doc.line(MARGIN, y, w - MARGIN, y);
  y += 8;

  // Warning icon area
  doc.setFillColor(255, 248, 225);
  doc.roundedRect(MARGIN, y - 3, CONTENT_W, 20, 3, 3, 'F');
  doc.setDrawColor(245, 166, 35);
  doc.setLineWidth(0.4);
  doc.roundedRect(MARGIN, y - 3, CONTENT_W, 20, 3, 3, 'S');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 100, 0);
  doc.text('⚠  AVISO LEGAL', MARGIN + 6, y + 3);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 80, 0);
  doc.text(
    'Este relatório é gerado por uma ferramenta de triagem e NÃO constitui diagnóstico médico.',
    MARGIN + 6,
    y + 9
  );
  doc.text(
    'Procure uma Unidade Básica de Saúde (UBS) para avaliação profissional. Tratamento gratuito pelo SUS.',
    MARGIN + 6,
    y + 13
  );

  y += 25;

  // ─── FOOTER ON ALL PAGES ───
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    drawFooter(doc, p, totalPages);
  }

  doc.save(`LeishCheck_Resultado_${new Date().toISOString().slice(0, 10)}.pdf`);
}
