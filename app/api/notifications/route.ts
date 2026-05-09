import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  sendBugSubmittedEmail,
  sendDesignCommentEmail,
  sendDesignUploadedEmail,
  sendDeliveryAcceptedEmail,
  sendDeliveryReadyEmail,
  sendPaymentConfirmedEmail,
  sendPaymentSubmittedEmail,
  sendQuoteSentEmail,
  sendRequirementsSubmittedEmail,
  sendScopeUploadedEmail,
} from '@/lib/email'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { type, projectId, ...rest } = body

  // Fetch project for context
  const { data: project } = await supabase.from('projects').select('name, client_id').eq('id', projectId).single()
  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

  // Fetch client email
  const { data: clientProfile } = await supabase.from('profiles').select('email, full_name').eq('id', project.client_id).single()

  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@416ai.studio'
  const clientEmail = clientProfile?.email ?? ''
  const projectName = project.name

  // Create notification record
  let message = ''
  let recipientId = ''

  switch (type) {
    case 'requirements_submitted':
      message = `新需求提交：${projectName}`
      recipientId = ''
      await sendRequirementsSubmittedEmail(adminEmail, projectName, clientEmail)
      break
    case 'scope_uploaded':
      message = `需求範圍文件已上傳，請確認`
      recipientId = project.client_id
      await sendScopeUploadedEmail(clientEmail, projectName)
      break
    case 'quote_sent':
      message = `你的項目報價已就緒`
      recipientId = project.client_id
      await sendQuoteSentEmail(clientEmail, projectName, rest.amount ?? 0)
      break
    case 'design_uploaded':
      message = `設計初稿已上傳，請審閱`
      recipientId = project.client_id
      await sendDesignUploadedEmail(clientEmail, projectName)
      break
    case 'design_comment':
      message = `設計意見：${rest.comment?.slice(0, 60)}`
      recipientId = ''
      await sendDesignCommentEmail(adminEmail, projectName, rest.comment ?? '')
      break
    case 'bug_submitted':
      message = `新 Bug：${rest.bugTitle} [${rest.severity}]`
      recipientId = ''
      await sendBugSubmittedEmail(adminEmail, projectName, rest.bugTitle ?? '', rest.severity ?? 'Minor')
      break
    case 'payment_submitted':
      message = `FPS 付款提交，待確認 HK$${rest.amount}`
      recipientId = ''
      await sendPaymentSubmittedEmail(adminEmail, projectName, rest.amount ?? 0, rest.paymentType ?? '')
      break
    case 'payment_confirmed':
      message = `付款已確認 HK$${rest.amount}`
      recipientId = project.client_id
      await sendPaymentConfirmedEmail(clientEmail, projectName, rest.amount ?? 0)
      break
    case 'delivery_ready':
      message = `項目交付物已就緒，請驗收`
      recipientId = project.client_id
      await sendDeliveryReadyEmail(clientEmail, projectName)
      break
    case 'delivery_accepted':
      message = `客戶已驗收項目：${projectName}`
      recipientId = ''
      await sendDeliveryAcceptedEmail(adminEmail, projectName, clientEmail)
      break
    default:
      message = type
  }

  // Insert notification record
  if (message) {
    const insertData: Record<string, unknown> = {
      project_id: projectId,
      type,
      message,
      read: false,
    }
    if (recipientId) insertData.user_id = recipientId
    await supabase.from('notifications').insert(insertData)
  }

  return NextResponse.json({ ok: true })
}
