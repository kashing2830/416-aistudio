'use client'
import { useEffect, useState } from 'react'

const PORTAL_URL = '/portal/login'

export default function MarketingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    // Scroll-triggered reveal
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); observer.unobserve(e.target) }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))

    // Sticky nav
    const nav = document.getElementById('main-nav')
    const onScroll = () => {
      if (nav) nav.style.background = window.scrollY > 20 ? 'rgba(10,10,10,.95)' : 'rgba(10,10,10,.85)'
    }
    window.addEventListener('scroll', onScroll)
    return () => { observer.disconnect(); window.removeEventListener('scroll', onScroll) }
  }, [])

  const faqs = [
    { q: '係 AI 做架？質量有保證嗎？', a: '係，AI 執行。但每個 Output 都有人手審核。你唔滿意設計，可以修改。你唔滿意產品，有 Bug Fix 期。最終你確認先付尾款。唔係盲目信機器，係用機器提速、用人確保質量。' },
    { q: '我唔識技術，可以合作嗎？', a: '完全可以。你只需要知道自己想要乜嘢。技術嘅嘢我哋處理，你唔需要識一行 Code。我哋幫你將 Idea 翻譯成技術語言，你只需要確認方向。' },
    { q: '3 日係真嘅嗎？', a: '簡單項目（如 Landing Page）係可以 3 日內完成。複雜系統（如 Web App）會需要更長時間。我哋喺報價時會俾你清晰嘅時間表，唔會亂咁講，唔交到就唔好意思。' },
    { q: '如果我唔滿意點算？', a: '設計階段你有 2 次免費修改。如果設計完全唔符合 Requirement，可以退 Design Deposit。開發完成後有 2 週免費 Bug Fix 期。所有條款喺開始前清楚列明。' },
    { q: '點解要俾 $500 需求確認費？', a: '整理你嘅需求同出報價需要時間同工具成本。$500 係呢個服務的費用，唔係騙你錢，係確保雙方都認真對待呢個合作。如果你唔接受報價，後續費用唔需俾。' },
    { q: '可以用廣東話溝通嗎？', a: '當然。我哋係香港人，廣東話、書面中文、英文都 OK。全程 Async 溝通，有紀錄可查，唔需要開會，唔需要電話。' },
  ]

  return (
    <>
      <style>{`
        :root {
          --bg:#0A0A0A; --bg1:#111111; --bg2:#181818;
          --border:rgba(255,255,255,0.07); --border-h:rgba(255,255,255,0.15);
          --text:#FFFFFF; --text-dim:rgba(255,255,255,0.52); --text-muted:rgba(255,255,255,0.28);
          --accent:#F5C518; --accent-dim:rgba(245,197,24,0.1); --accent-hover:#F7D244;
          --red:#FF4D4D; --red-dim:rgba(255,77,77,0.12);
          --green:#2ECC8A; --radius:12px; --max:1160px;
        }
        body{background:var(--bg);color:var(--text);font-family:'Noto Sans TC',sans-serif;font-size:16px;line-height:1.7;}
        @keyframes heroSlide{from{transform:translateY(22px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes glow{0%,100%{opacity:.6}50%{opacity:1}}
        .reveal{opacity:0;transform:translateY(28px);transition:opacity .6s ease,transform .6s ease}
        .reveal.in{opacity:1;transform:translateY(0)}
        .reveal-d1{transition-delay:.1s}.reveal-d2{transition-delay:.2s}.reveal-d3{transition-delay:.3s}.reveal-d4{transition-delay:.4s}
        .wrap{max-width:var(--max);margin:0 auto;padding:0 40px}
        section{padding:96px 0}
        section:nth-child(even){background:var(--bg1)}
        .sec-label{font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-bottom:14px}
        .sec-title{font-size:48px;font-weight:900;line-height:1.15;letter-spacing:-.02em}
        .sec-sub{font-size:17px;color:var(--text-dim);margin-top:14px;line-height:1.7}
        nav{position:fixed;top:0;left:0;right:0;z-index:999;height:64px;display:flex;align-items:center;background:rgba(10,10,10,.85);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);transition:background .2s}
        .nav-inner{display:flex;align-items:center;justify-content:space-between;width:100%}
        .logo{font-size:18px;font-weight:900;letter-spacing:.04em}
        .logo span{color:var(--accent)}
        .nav-ctas{display:flex;align-items:center;gap:12px}
        .btn{display:inline-flex;align-items:center;gap:8px;padding:10px 22px;border-radius:8px;font-family:inherit;font-size:14px;font-weight:700;cursor:pointer;transition:all .15s;border:none;text-decoration:none}
        .btn-primary{background:var(--accent);color:#0A0A0A}
        .btn-primary:hover{background:var(--accent-hover);transform:translateY(-1px)}
        .btn-outline{background:transparent;color:var(--text);border:1.5px solid var(--border-h)}
        .btn-outline:hover{border-color:var(--text);background:rgba(255,255,255,.05)}
        .btn-xl{padding:18px 40px;font-size:17px;border-radius:10px}
        #hero{position:relative;min-height:100vh;display:flex;align-items:center;padding:0;overflow:hidden}
        .hero-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px);background-size:64px 64px}
        .hero-glow{position:absolute;width:700px;height:500px;background:radial-gradient(ellipse,rgba(245,197,24,.07) 0%,transparent 65%);top:50%;left:50%;transform:translate(-60%,-50%);animation:glow 4s ease infinite;pointer-events:none}
        .hero-inner{position:relative;z-index:1;padding:120px 0 80px}
        .hero-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;background:var(--accent-dim);border:1px solid rgba(245,197,24,.25);border-radius:20px;font-size:12px;font-weight:700;color:var(--accent);letter-spacing:.04em;margin-bottom:28px;animation:heroSlide .5s ease both}
        .hero-h1{font-size:clamp(52px,8vw,92px);font-weight:900;line-height:1.06;letter-spacing:-.03em;animation:heroSlide .6s .08s ease both}
        .hero-h1 em{display:block;color:var(--accent);font-style:normal}
        .hero-sub{font-size:clamp(15px,2vw,19px);color:var(--text-dim);margin:22px 0 36px;line-height:1.65;max-width:560px;animation:heroSlide .6s .16s ease both}
        .hero-ctas{display:flex;gap:14px;flex-wrap:wrap;animation:heroSlide .6s .24s ease both}
        .hero-tags{display:flex;gap:20px;margin-top:52px;flex-wrap:wrap;animation:heroSlide .5s .3s ease both}
        .hero-tag{font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:6px}
        .hero-tag::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--accent);flex-shrink:0}
        .hero-code{position:absolute;right:5%;top:50%;transform:translateY(-50%);font-family:monospace;font-size:12px;color:rgba(255,255,255,.04);line-height:2;user-select:none;pointer-events:none;white-space:pre}
        .pain-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-top:48px}
        .pain-card{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:24px 24px 24px 20px;display:flex;gap:16px;align-items:flex-start;transition:border-color .2s}
        .pain-card:hover{border-color:var(--border-h)}
        .pain-x{width:36px;height:36px;border-radius:9px;background:var(--red-dim);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--red)}
        .pain-title{font-size:15px;font-weight:700;margin-bottom:4px}
        .pain-desc{font-size:13px;color:var(--text-dim);line-height:1.6}
        .sell-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px;margin-top:48px}
        .sell-card{background:var(--bg1);border:1px solid var(--border);border-radius:var(--radius);padding:32px;transition:border-color .2s,background .2s}
        .sell-card:hover{border-color:rgba(245,197,24,.3);background:#131200}
        .sell-num{font-size:52px;font-weight:900;color:var(--accent);line-height:1;margin-bottom:16px;letter-spacing:-.03em;opacity:.8}
        .sell-title{font-size:22px;font-weight:900;margin-bottom:10px;line-height:1.25}
        .sell-desc{font-size:14px;color:var(--text-dim);line-height:1.7}
        .svc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:48px}
        .svc-card{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:28px 24px;transition:border-color .2s}
        .svc-card:hover{border-color:var(--border-h)}
        .svc-icon{width:40px;height:40px;border-radius:10px;background:var(--accent-dim);display:flex;align-items:center;justify-content:center;margin-bottom:16px}
        .svc-title{font-size:16px;font-weight:700;margin-bottom:6px}
        .svc-desc{font-size:13px;color:var(--text-dim);line-height:1.6}
        .svc-tag{display:inline-block;margin-top:10px;font-size:10px;font-weight:700;letter-spacing:.06em;color:var(--accent);background:var(--accent-dim);padding:2px 8px;border-radius:4px}
        .svc-note{margin-top:36px;padding:18px 22px;background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);font-size:14px;color:var(--text-dim);display:flex;align-items:center;gap:12px}
        .price-sub{font-size:17px;color:var(--text-dim);margin-top:10px}
        .price-grid{display:grid;grid-template-columns:1fr 1.08fr 1fr;gap:16px;margin-top:48px;align-items:start}
        .price-card{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:32px 28px}
        .price-card.featured{background:#131200;border-color:rgba(245,197,24,.4);position:relative}
        .price-card.featured::before{content:'最受歡迎';position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--accent);color:#0A0A0A;font-size:10px;font-weight:800;letter-spacing:.06em;padding:3px 12px;border-radius:20px;white-space:nowrap}
        .price-type{font-size:13px;font-weight:700;color:var(--text-dim);letter-spacing:.06em;text-transform:uppercase;margin-bottom:12px}
        .price-from{font-size:11px;color:var(--text-muted);margin-bottom:4px}
        .price-amount{font-size:38px;font-weight:900;line-height:1;letter-spacing:-.03em;margin-bottom:16px}
        .price-amount span{font-size:18px;font-weight:500;color:var(--text-dim)}
        .price-items{list-style:none;display:flex;flex-direction:column;gap:8px;margin-bottom:24px}
        .price-items li{font-size:13px;color:var(--text-dim);display:flex;gap:10px;align-items:flex-start}
        .price-items li::before{content:'✓';color:var(--green);flex-shrink:0;font-weight:700}
        .price-lock{margin-top:36px;padding:18px 22px;background:var(--bg2);border:1px solid var(--border);border-left:3px solid var(--accent);border-radius:var(--radius);font-size:13px;color:var(--text-dim);line-height:1.6}
        .price-lock strong{color:var(--text)}
        .process-steps{display:grid;grid-template-columns:repeat(5,1fr);gap:0;margin-top:56px;position:relative}
        .process-steps::before{content:'';position:absolute;top:28px;left:10%;right:10%;height:1.5px;background:linear-gradient(90deg,transparent 0%,var(--border-h) 10%,var(--border-h) 90%,transparent 100%)}
        .step{display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 12px;position:relative;z-index:1}
        .step-num{width:56px;height:56px;border-radius:50%;background:var(--bg1);border:1.5px solid var(--border-h);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:900;color:var(--accent);margin-bottom:16px;flex-shrink:0}
        .step-title{font-size:14px;font-weight:700;margin-bottom:6px}
        .step-desc{font-size:12px;color:var(--text-dim);line-height:1.6}
        .faq-list{margin-top:48px;display:flex;flex-direction:column;gap:0;border:1px solid var(--border);border-radius:var(--radius);overflow:hidden}
        .faq-item{border-bottom:1px solid var(--border)}
        .faq-item:last-child{border-bottom:none}
        .faq-q{width:100%;background:none;border:none;padding:22px 28px;display:flex;align-items:center;justify-content:space-between;gap:16px;cursor:pointer;font-family:inherit;font-size:15px;font-weight:600;color:var(--text);text-align:left;transition:background .15s}
        .faq-q:hover{background:var(--bg2)}
        .faq-icon{width:24px;height:24px;border-radius:50%;border:1.5px solid var(--border-h);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--text-dim);font-size:16px;transition:transform .2s,background .2s}
        .faq-open .faq-icon{transform:rotate(45deg);background:var(--accent-dim);color:var(--accent);border-color:rgba(245,197,24,.3)}
        .faq-a{padding:0 28px 20px;font-size:14px;color:var(--text-dim);line-height:1.75}
        #cta{background:var(--bg1);text-align:center;padding:120px 0 0}
        .cta-h{font-size:clamp(36px,5vw,62px);font-weight:900;line-height:1.12;letter-spacing:-.02em;margin-bottom:18px}
        .cta-sub{font-size:17px;color:var(--text-dim);margin-bottom:36px}
        .cta-tags{display:flex;justify-content:center;gap:24px;margin-top:20px;flex-wrap:wrap}
        .cta-tag{font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:6px}
        .cta-tag::before{content:'·';color:var(--accent);font-size:20px;line-height:0}
        .footer-bar{margin-top:80px;padding:24px 0;border-top:1px solid var(--border);font-size:12px;color:var(--text-muted);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px}
        @media(max-width:768px){
          .wrap{padding:0 20px}section{padding:64px 0}
          .sec-title{font-size:32px}
          .pain-grid,.sell-grid{grid-template-columns:1fr}
          .svc-grid{grid-template-columns:repeat(2,1fr)}
          .price-grid{grid-template-columns:1fr}
          .process-steps{grid-template-columns:1fr;gap:24px}
          .process-steps::before{display:none}
          .step{flex-direction:row;text-align:left;gap:16px;align-items:flex-start}
          .nav-ctas .btn-outline{display:none}
          .hero-code{display:none}
        }
      `}</style>

      {/* Nav */}
      <nav id="main-nav">
        <div className="wrap nav-inner">
          <div className="logo"><span>416</span> AI Studio</div>
          <div className="nav-ctas">
            <a href="#pricing" className="btn btn-outline">定價</a>
            <a href={PORTAL_URL} className="btn btn-primary">開始項目 →</a>
          </div>
        </div>
      </nav>

      {/* S1: Hero */}
      <section id="hero">
        <div className="hero-grid" />
        <div className="hero-glow" />
        <div className="hero-code">{`const project = await AI.build({
  client: '你',
  idea: '任何嘢',
  delivery: '3 日'
})

deploy({ env: 'production' })
// ✓ Done. 真正可以用。`}</div>
        <div className="wrap hero-inner">
          <div className="hero-badge">🇭🇰 香港製造 · AI 執行 · 人手把關</div>
          <h1 className="hero-h1">你諗到嘅嘢<br /><em>我哋整得出</em></h1>
          <p className="hero-sub">AI 製作 · 人手把關 · 香港製造<br />最快 3 日交付。唔係 Mockup，係<strong>真正可以用嘅產品</strong>。</p>
          <div className="hero-ctas">
            <a href={PORTAL_URL} className="btn btn-primary btn-xl">立即開始項目 →</a>
            <a href="#services" className="btn btn-outline btn-xl">睇下我哋做過乜 ↓</a>
          </div>
          <div className="hero-tags">
            {['由 HKD $800 起', '最快 3 日交付', '做一 Part 計一 Part', '全程 Async 溝通'].map(t => (
              <div key={t} className="hero-tag">{t}</div>
            ))}
          </div>
        </div>
      </section>

      {/* S2: Pain Points */}
      <section id="pain">
        <div className="wrap">
          <div className="sec-label reveal">你係咪試過呢啲？</div>
          <h2 className="sec-title reveal reveal-d1">我哋知你痛喺邊</h2>
          <p className="sec-sub reveal reveal-d2">唔係你唔叻，係以前嘅選擇唔係為你設計嘅。</p>
          <div className="pain-grid">
            {[
              { title: 'Fiverr 印度仔唔明你講乜', desc: '解釋咗半天，交返黎完全唔係嗰回事。溝通唔到位，時間同錢都浪費晒。', d: 'reveal-d1' },
              { title: '本地公司報價十幾萬', desc: '開發費動輒 $80,000 起，仲要等幾個月。小型項目根本唔係佢地嘅優先。', d: 'reveal-d2' },
              { title: '自己玩 AI 只係出到 Mockup', desc: 'ChatGPT 幫你寫咗啲嘢，但唔識 Deploy，唔識整資料庫，最終得個樣睇唔到用。', d: 'reveal-d3' },
              { title: '一次付清，最後投訴無門', desc: '俾晒錢先做嘢，唔滿意又冇辦法。冇 Milestone，冇保障，只有後悔。', d: 'reveal-d4' },
            ].map(p => (
              <div key={p.title} className={`pain-card reveal ${p.d}`}>
                <div className="pain-x">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </div>
                <div><div className="pain-title">{p.title}</div><div className="pain-desc">{p.desc}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* S3: Selling Points */}
      <section id="why">
        <div className="wrap">
          <div className="sec-label reveal">點解揀我哋</div>
          <h2 className="sec-title reveal reveal-d1">四個理由，一個決定</h2>
          <div className="sell-grid">
            {[
              { n: '01', title: 'AI 製作，但有人對你負責', desc: '唔係你自己去玩 ChatGPT，係我哋用 AI 做，然後人手審核每一個細節，確保符合你要求先交俾你。機器快，人把關。', d: 'reveal-d1' },
              { n: '02', title: '唔洗去 Fiverr 搵印度仔', desc: '我哋係土生土長香港人。識廣東話，識香港市場，你講乜我哋明。溝通零障礙，唔洗擔心雞同鴨講，唔洗重複解釋。', d: 'reveal-d2' },
              { n: '03', title: '最快 3 日見到真身', desc: '唔係話俾你聽要等幾個月。你嘅 Idea，最快 3 日內會有真正可以 Deploy、可以用、可以俾你老闆睇的版本喺你面前。', d: 'reveal-d3' },
              { n: '04', title: '做一 Part 計一 Part', desc: 'Requirement 確認先付首期。設計確認先付設計費。開發確認先付開發費。每一步都係你 OK 先走下一步。唔老屈，唔蝕底。', d: 'reveal-d4' },
            ].map(s => (
              <div key={s.n} className={`sell-card reveal ${s.d}`}>
                <div className="sell-num">{s.n}</div>
                <div className="sell-title">{s.title}</div>
                <div className="sell-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* S4: Services */}
      <section id="services">
        <div className="wrap">
          <div className="sec-label reveal">服務範圍</div>
          <h2 className="sec-title reveal reveal-d1">我哋整得出乜嘢</h2>
          <div className="svc-grid">
            {[
              { icon: <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />, title: '企業網站 / Landing Page', desc: '展示你的業務，吸引潛在客戶，建立品牌形象。', tag: '由 HKD $800', d: 'reveal-d1' },
              { icon: <><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></>, title: 'Web App', desc: '有登入、預約、付款、管理功能的網絡應用系統。', tag: '由 HKD $2,000', d: 'reveal-d2' },
              { icon: <><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" /></>, title: '手機 App', desc: 'iOS / Android 原生或 React Native 跨平台應用程式。', tag: '由 HKD $5,000', d: 'reveal-d3' },
              { icon: <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />, title: '業務系統', desc: '庫存管理、客戶 CRM、內部工作流程等企業內部系統。', tag: '由 HKD $3,000', d: 'reveal-d1' },
              { icon: <><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" /></>, title: 'Pitch Deck', desc: '融資、銷售用的專業簡報，設計精美，一鍵演示。', tag: 'Add-on', d: 'reveal-d2' },
              { icon: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />, title: 'Logo / 品牌視覺', desc: '基本品牌識別，Logo 設計、色彩方案、字型選擇。', tag: 'Add-on', d: 'reveal-d3' },
            ].map(s => (
              <div key={s.title} className={`svc-card reveal ${s.d}`}>
                <div className="svc-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5C518" strokeWidth="1.6" strokeLinecap="round">{s.icon}</svg>
                </div>
                <div className="svc-title">{s.title}</div>
                <div className="svc-desc">{s.desc}</div>
                <div className="svc-tag">{s.tag}</div>
              </div>
            ))}
          </div>
          <div className="svc-note reveal">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F5C518" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
            唔確定自己需要邊樣？<a href={PORTAL_URL} style={{ color: 'var(--accent)', fontWeight: 700 }}>入去填個需求表</a>，我哋幫你判斷最適合的方案。
          </div>
        </div>
      </section>

      {/* S5: Pricing */}
      <section id="pricing">
        <div className="wrap">
          <div className="sec-label reveal">定價</div>
          <h2 className="sec-title reveal reveal-d1">幾多錢？</h2>
          <p className="price-sub reveal reveal-d2">由 HKD $800 起。按你嘅需求報價，唔會多收一分。</p>
          <div className="price-grid">
            <div className="price-card reveal reveal-d1">
              <div className="price-type">網站</div>
              <div className="price-from">起步價</div>
              <div className="price-amount">$800<span> HKD</span></div>
              <ul className="price-items">
                {['企業官網 / Landing Page', '響應式手機版', '基本 SEO 設定', '部署至 Vercel'].map(i => <li key={i}>{i}</li>)}
              </ul>
              <a href={PORTAL_URL} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>開始項目</a>
            </div>
            <div className="price-card featured reveal reveal-d2">
              <div className="price-type" style={{ color: 'var(--accent)' }}>Web App</div>
              <div className="price-from">起步價</div>
              <div className="price-amount" style={{ color: 'var(--accent)' }}>$2,000<span style={{ color: 'var(--text-dim)' }}> HKD</span></div>
              <ul className="price-items">
                {['用戶登入系統', '資料庫 + 後台', 'Stripe 付款整合', '電郵通知功能', '管理員後台'].map(i => <li key={i}>{i}</li>)}
              </ul>
              <a href={PORTAL_URL} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>開始項目</a>
            </div>
            <div className="price-card reveal reveal-d3">
              <div className="price-type">SME 系統</div>
              <div className="price-from">起步價</div>
              <div className="price-amount">$3,000<span> HKD</span></div>
              <ul className="price-items">
                {['預約 / Booking 系統', '客戶管理 CRM', '庫存 / 訂單管理', '管理員後台'].map(i => <li key={i}>{i}</li>)}
              </ul>
              <a href={PORTAL_URL} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>開始項目</a>
            </div>
          </div>
          <div className="price-lock reveal" style={{ marginTop: 20 }}>
            <strong>Requirement Lock Fee</strong> — 每個項目需要繳付 <strong>$500–1,000</strong> 的需求確認費，用於整理需求及出報價。如果你唔接受報價，其餘費用唔需俾。
          </div>
        </div>
      </section>

      {/* S6: Process */}
      <section id="process">
        <div className="wrap">
          <div className="sec-label reveal">合作流程</div>
          <h2 className="sec-title reveal reveal-d1">點樣合作？</h2>
          <p className="sec-sub reveal reveal-d2">5 個步驟，由 Idea 到交付，全程透明。</p>
          <div className="process-steps">
            {[
              { n: '1', t: '填寫需求表', d: '告訴我哋你想整乜，唔需要技術知識', delay: 'reveal-d1' },
              { n: '2', t: '確認方向 + 報價', d: '整理需求，出清晰報價，你 OK 先付款', delay: 'reveal-d2' },
              { n: '3', t: '睇設計初稿', d: 'AI 生成設計，你睇、你改（最多 2 次）', delay: 'reveal-d3' },
              { n: '4', t: '開發 + 追蹤進度', d: 'Dashboard 即時睇到每個 Milestone', delay: 'reveal-d4' },
              { n: '5', t: '測試 + 交付', d: '你測試有 Bug 修，滿意先付尾款', delay: '' },
            ].map((s, i) => (
              <div key={s.n} className={`step reveal ${s.delay}`}>
                <div className="step-num" style={i === 4 ? { background: 'rgba(245,197,24,0.1)', borderColor: 'rgba(245,197,24,.4)', color: 'var(--accent)' } : {}}>{s.n}</div>
                <div><div className="step-title">{s.t}</div><div className="step-desc">{s.d}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* S7: FAQ */}
      <section id="faq">
        <div className="wrap">
          <div className="sec-label reveal">FAQ</div>
          <h2 className="sec-title reveal reveal-d1">你可能想問</h2>
          <div className="faq-list reveal reveal-d2">
            {faqs.map((faq, i) => (
              <div key={i} className={`faq-item${openFaq === i ? ' faq-open' : ''}`}>
                <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {faq.q}
                  <span className="faq-icon">+</span>
                </button>
                {openFaq === i && <div className="faq-a">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* S8: CTA + Footer */}
      <section id="cta">
        <div className="wrap">
          <div className="reveal"><div className="sec-label" style={{ textAlign: 'center' }}>準備好未？</div></div>
          <h2 className="cta-h reveal reveal-d1">準備好將你嘅 Idea<br />變成現實？</h2>
          <p className="cta-sub reveal reveal-d2">唔需要技術知識。唔需要一次付清。<br />只需要告訴我哋你想要乜。</p>
          <div className="reveal reveal-d3">
            <a href={PORTAL_URL} className="btn btn-primary btn-xl">立即開始項目 →</a>
          </div>
          <div className="cta-tags reveal reveal-d4">
            {['由 HKD $800 起', '最快 3 日交付', '香港製造'].map(t => <div key={t} className="cta-tag">{t}</div>)}
          </div>
        </div>
        <div className="wrap">
          <div className="footer-bar">
            <span>© 2026 416 AI Studio</span>
            <span>全程 AI 製作，人手把關 · 香港製造</span>
            <a href={PORTAL_URL} style={{ color: 'var(--text-muted)' }}>Client Portal →</a>
          </div>
        </div>
      </section>
    </>
  )
}
