import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM_EMAIL || 'noreply@416.studio'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

async function send(to: string, subject: string, html: string) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.startsWith('re_placeholder')) {
    console.log('[Email mock]', subject, '->', to)
    return
  }
  await resend.emails.send({ from: `416 AI Studio <${FROM}>`, to, subject, html })
}

export async function sendRequirementsSubmittedEmail(adminEmail: string, projectName: string, clientEmail: string) {
  return send(adminEmail, `[新項目] ${projectName} — 需求表已提交`,
    `<p>客戶 <strong>${clientEmail}</strong> 已提交項目需求：<strong>${projectName}</strong></p>
     <p><a href="${APP_URL}/admin/dashboard">前往 Admin Dashboard 審閱 →</a></p>`)
}

export async function sendScopeUploadedEmail(clientEmail: string, projectName: string) {
  return send(clientEmail, `[${projectName}] Scope Document 已上傳，請查閱`,
    `<p>你的項目 <strong>${projectName}</strong> 的 Scope Document 已上傳，請查閱並確認。</p>
     <p><a href="${APP_URL}/portal/scope">查看 Scope Document →</a></p>`)
}

export async function sendQuoteSentEmail(clientEmail: string, projectName: string, amount: number) {
  return send(clientEmail, `[${projectName}] 報價單已出，請查閱`,
    `<p>你的項目 <strong>${projectName}</strong> 的正式報價單已生成，金額為 <strong>HK$${amount.toLocaleString()}</strong>。</p>
     <p><a href="${APP_URL}/portal/quote">查看報價單 →</a></p>`)
}

export async function sendDesignUploadedEmail(clientEmail: string, projectName: string) {
  return send(clientEmail, `[${projectName}] 設計初稿已上傳，請審閱`,
    `<p>你的項目 <strong>${projectName}</strong> 的設計初稿已上傳，請查閱並提交意見或確認。</p>
     <p><a href="${APP_URL}/portal/design">查看設計稿 →</a></p>`)
}

export async function sendDesignCommentEmail(adminEmail: string, projectName: string, comment: string) {
  return send(adminEmail, `[${projectName}] 客戶提出設計修改意見`,
    `<p>客戶對 <strong>${projectName}</strong> 的設計提出意見：</p>
     <blockquote>${comment}</blockquote>
     <p><a href="${APP_URL}/admin/dashboard">前往 Admin Dashboard →</a></p>`)
}

export async function sendBugSubmittedEmail(adminEmail: string, projectName: string, bugTitle: string, severity: string) {
  return send(adminEmail, `[${projectName}] 新 Bug (${severity})：${bugTitle}`,
    `<p>客戶提交了新 Bug：<strong>${bugTitle}</strong></p>
     <p>嚴重程度：<strong>${severity}</strong></p>
     <p><a href="${APP_URL}/admin/dashboard">前往 Admin Dashboard 處理 →</a></p>`)
}

export async function sendPaymentSubmittedEmail(adminEmail: string, projectName: string, amount: number, paymentType: string) {
  return send(adminEmail, `[${projectName}] FPS 付款提交，待確認 HK$${amount.toLocaleString()}`,
    `<p>客戶已通過 FPS 提交付款 <strong>HK$${amount.toLocaleString()}</strong>（${paymentType}）。</p>
     <p><a href="${APP_URL}/admin/payments">前往確認付款 →</a></p>`)
}

export async function sendPaymentConfirmedEmail(clientEmail: string, projectName: string, amount: number) {
  return send(clientEmail, `[${projectName}] 付款已確認 HK$${amount.toLocaleString()}`,
    `<p>你的付款 <strong>HK$${amount.toLocaleString()}</strong> 已確認。</p>
     <p>感謝你的支持，我們將繼續推進項目進度。</p>`)
}

export async function sendDeliveryReadyEmail(clientEmail: string, projectName: string) {
  return send(clientEmail, `[${projectName}] 項目交付物已就緒，請驗收`,
    `<p>你的項目 <strong>${projectName}</strong> 已完成，請前往驗收並下載交付物。</p>
     <p><a href="${APP_URL}/portal/delivery">前往驗收頁面 →</a></p>`)
}

export async function sendDeliveryAcceptedEmail(adminEmail: string, projectName: string, clientEmail: string) {
  return send(adminEmail, `[${projectName}] 客戶已驗收項目`,
    `<p>客戶 <strong>${clientEmail}</strong> 已確認驗收項目 <strong>${projectName}</strong>，項目正式完結。</p>`)
}
