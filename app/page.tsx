'use client'
import { useEffect, useState } from 'react'

const PORTAL_URL = '/portal/login'

export default function MarketingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); observer.unobserve(e.target) }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))

    const nav = document.getElementById('main-nav')
    const onScroll = () => {
      if (nav) nav.style.background = window.scrollY > 20 ? 'rgba(10,10,10,.95)' : 'rgba(10,10,10,.85)'
    }
    window.addEventListener('scroll', onScroll)
    return () => { observer.disconnect(); window.removeEventListener('scroll', onScroll) }
  }, [])

  const faqs = [
    { q: '你哋係咪外包出去做架？', a: '唔係。係我哋直接做，直接對你負責。無中間人，無轉介。' },
    { q: '我唔識技術，可以合作嗎？', a: '完全可以。你只需要知道自己想要乜嘢。技術嘅嘢我哋處理，你唔需要識一行 Code。' },
    { q: '三日係真的嗎？', a: '簡單項目（如 Landing Page）係可以三日內完成。複雜系統會更長。我哋喺報價時會俾你清晰的時間表，唔會亂咁承諾。' },
    { q: '如果我唔滿意點算？', a: '設計階段你有兩次免費修改。如果設計完全唔符合方向，可以退 Design Deposit。開發完成後有兩週 Bug Fix 期。最終你確認滿意先付尾款。' },
    { q: '點解要俾 $500 需求確認費？', a: '整理需求同出報價需要時間。$500 係呢個服務的費用，唔係騙你錢。係確保雙方都認真對待呢個合作。如果你覺得連 $500 都唔想俾，我哋可能唔係適合嘅合作對象。' },
    { q: '可以用廣東話溝通嗎？', a: '當然。我哋係香港人。廣東話、書面中文、英文都 OK。' },
    { q: '你哋係用咩工具做？', a: '呢個係我哋嘅內部運作，唔係你需要擔心嘅事。你需要擔心嘅係：最終交俾你嘅嘢係咪你想要嘅。答案係：係。' },
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
        .hero-sub{font-size:clamp(15px,2vw,19px);color:var(--text-dim);margin:22px 0 36px;line-height:1.75;max-width:560px;animation:heroSlide .6s .16s ease both}
        .hero-ctas{display:flex;gap:14px;flex-wrap:wrap;animation:heroSlide .6s .24s ease both}
        .hero-tags{display:flex;gap:20px;margin-top:52px;flex-wrap:wrap;animation:heroSlide .5s .3s ease both}
        .hero-tag{font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:6px}
        .hero-tag::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--accent);flex-shrink:0}
        .hero-code{position:absolute;right:5%;top:50%;transform:translateY(-50%);font-family:monospace;font-size:13px;color:rgba(255,255,255,.04);line-height:2.2;user-select:none;pointer-events:none;white-space:pre}
        /* Stats Bar */
        #stats{padding:0 !important;background:#000 !important;border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
        .stats-bar{display:grid;grid-template-columns:repeat(3,1fr)}
        .stats-item{padding:56px 40px;text-align:center;border-right:1px solid var(--border);position:relative}
        .stats-item:last-child{border-right:none}
        .stats-num{font-size:clamp(64px,9vw,108px);font-weight:900;line-height:1;letter-spacing:-.04em;color:var(--accent);margin-bottom:6px}
        .stats-unit{font-size:clamp(28px,4vw,48px);color:rgba(255,255,255,0.3);font-weight:500;margin-left:4px}
        .stats-arrow{font-size:20px;color:rgba(255,255,255,.2);margin:10px 0}
        .stats-label strong{color:var(--text);display:block;font-size:17px;font-weight:700;margin-bottom:4px}
        .stats-label{font-size:14px;color:var(--text-dim);line-height:1.5;max-width:240px;margin:0 auto}
        /* Pain */
        .pain-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-top:48px}
        .pain-card{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:24px 24px 24px 20px;display:flex;gap:16px;align-items:flex-start;transition:border-color .2s}
        .pain-card:hover{border-color:var(--border-h)}
        .pain-x{width:36px;height:36px;border-radius:9px;background:var(--red-dim);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--red)}
        .pain-title{font-size:15px;font-weight:700;margin-bottom:4px}
        .pain-desc{font-size:13px;color:var(--text-dim);line-height:1.6}
        /* Selling */
        .sell-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px;margin-top:48px}
        .sell-card{background:var(--bg1);border:1px solid var(--border);border-radius:var(--radius);padding:32px;transition:border-color .2s,background .2s}
        .sell-card:hover{border-color:rgba(245,197,24,.3);background:#131200}
        .sell-num{font-size:52px;font-weight:900;color:var(--accent);line-height:1;margin-bottom:16px;letter-spacing:-.03em;opacity:.8}
        .sell-title{font-size:22px;font-weight:900;margin-bottom:10px;line-height:1.25}
        .sell-desc{font-size:14px;color:var(--text-dim);line-height:1.7}
        /* Portfolio */
        #portfolio{background:var(--bg) !important}
        .port-grid{display:flex;flex-direction:column;gap:24px;margin-top:48px}
        .port-card{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:36px;display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center;transition:border-color .2s}
        .port-card:hover{border-color:var(--border-h)}
        .port-days-row{display:flex;align-items:baseline;gap:8px;margin-bottom:14px}
        .port-days{font-size:52px;font-weight:900;color:var(--accent);line-height:1;letter-spacing:-.03em}
        .port-days-unit{font-size:22px;color:rgba(255,255,255,0.35);font-weight:500}
        .port-days-label{font-size:11px;color:var(--text-muted);font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-left:4px}
        .port-title{font-size:22px;font-weight:900;margin-bottom:10px;line-height:1.3}
        .port-desc{font-size:13px;color:var(--text-dim);line-height:1.7}
        .port-img-area{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .port-img-placeholder{background:var(--bg1);border:1px solid var(--border);border-radius:8px;aspect-ratio:16/10;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:11px;color:var(--text-muted);text-align:center;padding:12px;gap:6px}
        .port-footer{margin-top:36px;padding:28px 36px;background:var(--bg1);border:1px solid rgba(245,197,24,.15);border-radius:var(--radius);text-align:center;line-height:1.8;color:var(--text-dim)}
        .port-footer strong{color:var(--text);display:block;font-size:20px;font-weight:900;margin-bottom:8px}
        /* Services */
        .svc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:48px}
        .svc-card{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:28px 24px;transition:border-color .2s}
        .svc-card:hover{border-color:var(--border-h)}
        .svc-icon{width:40px;height:40px;border-radius:10px;background:var(--accent-dim);display:flex;align-items:center;justify-content:center;margin-bottom:16px}
        .svc-title{font-size:16px;font-weight:700;margin-bottom:6px}
        .svc-desc{font-size:13px;color:var(--text-dim);line-height:1.6}
        .svc-tag{display:inline-block;margin-top:10px;font-size:10px;font-weight:700;letter-spacing:.06em;color:var(--accent);background:var(--accent-dim);padding:2px 8px;border-radius:4px}
        .svc-note{margin-top:36px;padding:18px 22px;background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);font-size:14px;color:var(--text-dim);display:flex;align-items:center;gap:12px}
        /* Pricing */
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
        .price-lock{margin-top:20px;padding:18px 22px;background:var(--bg2);border:1px solid var(--border);border-left:3px solid var(--accent);border-radius:var(--radius);font-size:13px;color:var(--text-dim);line-height:1.6}
        .price-lock strong{color:var(--text)}
        /* 快唔等於唔值錢 */
        #speed{background:var(--bg1) !important}
        .speed-quote{font-size:clamp(16px,2.2vw,22px);line-height:1.9;color:var(--text-dim);max-width:760px;margin:48px 0 52px;padding:32px 36px;background:var(--bg2);border:1px solid var(--border);border-left:3px solid var(--accent);border-radius:var(--radius)}
        .speed-quote em{color:var(--text);font-style:normal;font-weight:700}
        .versus-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px}
        .versus-card{border-radius:var(--radius);padding:28px 24px}
        .versus-card.bad{background:rgba(255,77,77,0.05);border:1px solid rgba(255,77,77,0.2)}
        .versus-card.good{background:rgba(245,197,24,0.05);border:1px solid rgba(245,197,24,0.25)}
        .versus-card.conclusion{background:var(--bg2);border:1px solid var(--border)}
        .versus-label{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:18px}
        .versus-label.bad{color:var(--red)}
        .versus-label.good{color:var(--accent)}
        .versus-label.conclusion{color:var(--green)}
        .versus-items{display:flex;flex-direction:column;gap:12px}
        .versus-item{font-size:13px;color:var(--text-dim);line-height:1.55;display:flex;gap:10px}
        .versus-item::before{flex-shrink:0;margin-top:2px;font-weight:700}
        .versus-item.bad::before{content:'✗';color:var(--red)}
        .versus-item.good::before{content:'✓';color:var(--accent)}
        .versus-item.conclusion::before{content:'→';color:var(--green)}
        .speed-disclaimer{margin-top:32px;padding:20px 24px;background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);font-size:13px;color:var(--text-muted);line-height:1.8}
        .speed-disclaimer strong{color:var(--text-dim)}
        /* Process */
        .process-steps{display:grid;grid-template-columns:repeat(5,1fr);gap:0;margin-top:56px;position:relative}
        .process-steps::before{content:'';position:absolute;top:28px;left:10%;right:10%;height:1.5px;background:linear-gradient(90deg,transparent 0%,var(--border-h) 10%,var(--border-h) 90%,transparent 100%)}
        .step{display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 12px;position:relative;z-index:1}
        .step-num{width:56px;height:56px;border-radius:50%;background:var(--bg1);border:1.5px solid var(--border-h);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:900;color:var(--accent);margin-bottom:16px;flex-shrink:0}
        .step-title{font-size:14px;font-weight:700;margin-bottom:6px}
        .step-desc{font-size:12px;color:var(--text-dim);line-height:1.6}
        /* FAQ */
        .faq-list{margin-top:48px;display:flex;flex-direction:column;gap:0;border:1px solid var(--border);border-radius:var(--radius);overflow:hidden}
        .faq-item{border-bottom:1px solid var(--border)}
        .faq-item:last-child{border-bottom:none}
        .faq-q{width:100%;background:none;border:none;padding:22px 28px;display:flex;align-items:center;justify-content:space-between;gap:16px;cursor:pointer;font-family:inherit;font-size:15px;font-weight:600;color:var(--text);text-align:left;transition:background .15s}
        .faq-q:hover{background:var(--bg2)}
        .faq-icon{width:24px;height:24px;border-radius:50%;border:1.5px solid var(--border-h);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--text-dim);font-size:16px;transition:transform .2s,background .2s}
        .faq-open .faq-icon{transform:rotate(45deg);background:var(--accent-dim);color:var(--accent);border-color:rgba(245,197,24,.3)}
        .faq-a{padding:0 28px 20px;font-size:14px;color:var(--text-dim);line-height:1.75}
        /* CTA */
        #cta{background:var(--bg1);text-align:center;padding:120px 0 0}
        .cta-h{font-size:clamp(36px,5vw,62px);font-weight:900;line-height:1.12;letter-spacing:-.02em;margin-bottom:18px}
        .cta-sub{font-size:17px;color:var(--text-dim);margin-bottom:36px;line-height:1.9}
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
          .stats-bar{grid-template-columns:1fr}
          .stats-item{border-right:none;border-bottom:1px solid var(--border)}
          .stats-item:last-child{border-bottom:none}
          .port-card{grid-template-columns:1fr}
          .port-img-area{grid-template-columns:1fr 1fr}
          .versus-grid{grid-template-columns:1fr}
          .speed-quote{padding:20px 22px}
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
        <div className="hero-code">{`你嘅 Idea
    ↓
需求確認
    ↓
設計初稿
    ↓
開發交付
    ↓
真正能用嘅產品`}</div>
        <div className="wrap hero-inner">
          <div className="hero-badge">🇭🇰 香港製造 · PM 主導 · 交付為本</div>
          <h1 className="hero-h1">你諗到嘅嘢<br /><em>三日內攞到手</em></h1>
          <p className="hero-sub">
            我哋唔係開發公司。<br />
            我哋係一個識得將你嘅 Idea 極速變成真實產品的團隊。<br />
            <strong style={{ color: 'var(--text)' }}>PM 主導。Sales 思維。交付為本。</strong>
          </p>
          <div className="hero-ctas">
            <a href={PORTAL_URL} className="btn btn-primary btn-xl">開始你的項目 →</a>
            <a href="#stats" className="btn btn-outline btn-xl">睇下我哋點運作 ↓</a>
          </div>
          <div className="hero-tags">
            {['由 HKD $3,000 起', '最快 3 日交付', '做一 Part 計一 Part', '香港團隊直接負責'].map(t => (
              <div key={t} className="hero-tag">{t}</div>
            ))}
          </div>
        </div>
      </section>

      {/* S1.5: Stats Bar */}
      <section id="stats">
        <div className="wrap">
          <div className="stats-bar">
            {[
              { num: '1', label: '網站 + 管理後台', sub: '從零到上線', d: 'reveal-d1' },
              { num: '3', label: '完整業務管理系統', sub: '配對、CRM、個案全包', d: 'reveal-d2' },
              { num: '7', label: 'iOS + Android 雙平台 App', sub: '真實上架', d: 'reveal-d3' },
            ].map((s, i) => (
              <div key={i} className={`stats-item reveal ${s.d}`}>
                <div className="stats-num">{s.num}<span className="stats-unit"> 日</span></div>
                <div className="stats-label">
                  <strong>{s.label}</strong>
                  {s.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* S2: Pain Points */}
      <section id="pain">
        <div className="wrap">
          <div className="sec-label reveal">你係咪試過呢啲？</div>
          <h2 className="sec-title reveal reveal-d1">我哋知你痛喺邊</h2>
          <div className="pain-grid">
            {[
              { title: '去過外國平台，對方唔明你講乜', desc: '交返嚟完全唔係嗰回事。時間同錢都浪費晒，最後仲要重頭嚟過。', d: 'reveal-d1' },
              { title: '搵過本地公司，報價十幾萬', desc: '仲話要等三至六個月。小型項目根本唔係佢地嘅優先。', d: 'reveal-d2' },
              { title: '自己嘗試過，最終只係得個 Mockup', desc: '花咗幾個星期，唔係真正能用嘅嘢。識 Deploy 先算識做。', d: 'reveal-d3' },
              { title: '一次過俾晒錢，最後投訴無門', desc: '交唔到或者唔係你想要嘅，俾晒錢先知冇辦法。', d: 'reveal-d4' },
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
          <div className="sec-label reveal">點解係我哋？</div>
          <h2 className="sec-title reveal reveal-d1">四個理由，一個決定</h2>
          <div className="sell-grid">
            {[
              {
                n: '01',
                title: '土生土長香港人，你講咩我哋明',
                desc: '唔係外包，唔係轉介，唔係「幫你溝通個外國團隊」。係我哋直接做，直接對你負責。你講廣東話，我哋就廣東話傾。你要乜，我哋真係明。',
                d: 'reveal-d1'
              },
              {
                n: '02',
                title: 'PM 主導，唔係純粹接單',
                desc: '好多人唔知自己真正需要乜嘢。我哋唔係你話乜就做乜——我哋會幫你想清楚需求，識別風險，確保最終交出嚟嘅嘢係你真正需要嘅，而唔係你以為你需要嘅。',
                d: 'reveal-d2'
              },
              {
                n: '03',
                title: '快，係因為我哋有一套系統',
                desc: '三日交付唔係靠捷徑，係靠我哋建立咗一套經過驗證嘅交付流程。需求確認、設計審閱、開發、測試——每個環節都有清晰規範，唔會因為溝通混亂而拖延。你嘅時間係有價值嘅。我哋唔會浪費佢。',
                d: 'reveal-d3'
              },
              {
                n: '04',
                title: '做一 Part，計一 Part，唔老屈',
                desc: '需求確認先付首期。設計你 OK 先付設計費。開發完成你試用，滿意先付尾款。每一步都係你話事。唔會有「已經開始做了你要俾錢」呢種情況。',
                d: 'reveal-d4'
              },
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

      {/* S3.5: Portfolio */}
      <section id="portfolio">
        <div className="wrap">
          <div className="sec-label reveal">真實案例</div>
          <h2 className="sec-title reveal reveal-d1">唔係講嘢。<br />呢啲係真實做出嚟嘅。</h2>
          <div className="port-grid">
            {[
              {
                days: '3',
                title: '女傭中心完整業務系統',
                desc: '對外官網 + 內部管理後台。女傭配對系統、僱主 CRM、個案 Pipeline、CV 生成、收支財務。',
                imgs: ['stronghelper.hk 官網', 'Admin Dashboard'],
                d: 'reveal-d1'
              },
              {
                days: '7',
                title: 'iOS + Android 雙平台手機 App',
                desc: '僱主管理女傭的完整 App。今日任務、本週菜單、薪酬計算、出糧記錄、重要文件管理。',
                imgs: ['App 主頁', '出糧記錄'],
                d: 'reveal-d2'
              },
              {
                days: '1',
                title: 'NGO 求助配對系統',
                desc: '前台求助表格 + 後台管理系統。求助記錄、配對狀態追蹤、CSV 匯出。',
                imgs: ['解難營業所官網', 'Admin 後台'],
                d: 'reveal-d3'
              },
            ].map(p => (
              <div key={p.title} className={`port-card reveal ${p.d}`}>
                <div>
                  <div className="port-days-row">
                    <span className="port-days">{p.days}</span>
                    <span className="port-days-unit">日</span>
                    <span className="port-days-label">完成</span>
                  </div>
                  <div className="port-title">{p.title}</div>
                  <div className="port-desc">{p.desc}</div>
                </div>
                <div className="port-img-area">
                  {p.imgs.map(img => (
                    <div key={img} className="port-img-placeholder">
                      <span>{img}</span>
                      <span style={{ opacity: 0.35, fontSize: '10px' }}>截圖即將上線</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="port-footer reveal">
            <strong>每個都係真實運作中的系統。</strong>
            唔係 Demo，唔係 Mockup。<br />你的，會係下一個。
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
              { icon: <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />, title: '企業網站 / Landing Page', desc: '展示你嘅業務，吸引客人，建立信任。', tag: '由 HKD $3,000', d: 'reveal-d1' },
              { icon: <><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></>, title: 'Web App', desc: '有登入、預約、表單、管理後台的網絡應用系統。', tag: '由 HKD $8,000', d: 'reveal-d2' },
              { icon: <><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" /></>, title: '手機 App', desc: 'iOS / Android 應用程式。', tag: '由 HKD $20,000', d: 'reveal-d3' },
              { icon: <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />, title: '業務系統', desc: '庫存管理、客戶追蹤、內部工作流程——任何令你業務運作更順暢的系統。', tag: '由 HKD $8,000', d: 'reveal-d1' },
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
            唔確定自己需要邊樣？<a href={PORTAL_URL} style={{ color: 'var(--accent)', fontWeight: 700 }}>填個需求表</a>，我哋幫你判斷。免費。
          </div>
        </div>
      </section>

      {/* S5: Pricing */}
      <section id="pricing">
        <div className="wrap">
          <div className="sec-label reveal">定價</div>
          <h2 className="sec-title reveal reveal-d1">幾多錢？</h2>
          <p className="price-sub reveal reveal-d2">由 HKD $3,000 起。按需求報價，唔會多收一分。</p>
          <div className="price-grid">
            <div className="price-card reveal reveal-d1">
              <div className="price-type">網站</div>
              <div className="price-from">起步價</div>
              <div className="price-amount">$3,000<span> HKD</span></div>
              <ul className="price-items">
                {['企業官網 / Landing Page', '響應式手機版', '基本 SEO 設定', '部署至 Vercel'].map(i => <li key={i}>{i}</li>)}
              </ul>
              <a href={PORTAL_URL} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>開始項目</a>
            </div>
            <div className="price-card featured reveal reveal-d2">
              <div className="price-type" style={{ color: 'var(--accent)' }}>Web App</div>
              <div className="price-from">起步價</div>
              <div className="price-amount" style={{ color: 'var(--accent)' }}>$8,000<span style={{ color: 'var(--text-dim)' }}> HKD</span></div>
              <ul className="price-items">
                {['用戶登入系統', '資料庫 + 管理後台', 'Stripe 付款整合', '電郵通知功能', '管理員後台'].map(i => <li key={i}>{i}</li>)}
              </ul>
              <a href={PORTAL_URL} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>開始項目</a>
            </div>
            <div className="price-card reveal reveal-d3">
              <div className="price-type">App / 系統</div>
              <div className="price-from">起步價</div>
              <div className="price-amount">$20,000<span> HKD</span></div>
              <ul className="price-items">
                {['手機 App（iOS + Android）', '複雜業務系統', '客戶管理 CRM', '管理員後台'].map(i => <li key={i}>{i}</li>)}
              </ul>
              <a href={PORTAL_URL} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>開始項目</a>
            </div>
          </div>
          <div className="price-lock reveal">
            <strong>需求確認費 $500–1,000</strong> — 用於整理需求及出報價。設計你 OK 先付設計費。開發完成你試用，滿意先付尾款。如果你唔接受報價，其餘費用唔需俾。
          </div>
        </div>
      </section>

      {/* S6: 快唔等於唔值錢 */}
      <section id="speed">
        <div className="wrap">
          <div className="sec-label reveal">關於速度</div>
          <h2 className="sec-title reveal reveal-d1">快，先係最值錢嘅嘢。</h2>
          <div className="speed-quote reveal reveal-d2">
            有人會話：「咁快整得出嚟，係咪唔值錢？」<br /><br />
            我哋嘅答案係：<br /><br />
            <em>你去睇醫生，好醫生五分鐘就知你患咩病。</em><br />
            差醫生要你等一個鐘，做十個多餘檢查，最後仲可能係錯的。<br /><br />
            你係要俾多啲錢畀嗰個「等你等耐啲」嘅人？<br />
            定係揀嗰個 <em>「一眼睇穿問題，馬上解決」</em> 嘅人？<br /><br />
            <em>速度係能力的體現，唔係偷工減料的藉口。</em>
          </div>
          <div className="versus-grid">
            <div className="versus-card bad reveal reveal-d1">
              <div className="versus-label bad">傳統做法</div>
              <div className="versus-items">
                {['三至六個月', '十幾廿萬', '大量會議、進度不透明', '你唔知佢做緊乜'].map(i => (
                  <div key={i} className="versus-item bad">{i}</div>
                ))}
              </div>
            </div>
            <div className="versus-card good reveal reveal-d2">
              <div className="versus-label good">416 的做法</div>
              <div className="versus-items">
                {['三日至三星期（視乎複雜度）', '清晰定價，按 Stage 付款', '全程透明，Dashboard 睇到每個進度', '有問題即時回應'].map(i => (
                  <div key={i} className="versus-item good">{i}</div>
                ))}
              </div>
            </div>
            <div className="versus-card conclusion reveal reveal-d3">
              <div className="versus-label conclusion">結論</div>
              <div className="versus-items">
                {['我哋快，係因為我哋有系統、有能力。', '唔係因為我哋做得少、做得差。'].map(i => (
                  <div key={i} className="versus-item conclusion">{i}</div>
                ))}
              </div>
            </div>
          </div>
          <div className="speed-disclaimer reveal">
            我哋唔接受「要求極多但預算極低」嘅項目。唔係我哋唔想做，係對雙方都唔公平。<br />
            如果你覺得一個網站理應係幾百蚊整出嚟，<strong>我哋唔係你嘅選擇</strong>——但我哋可以老實話俾你知點樣可以搵到。
          </div>
        </div>
      </section>

      {/* S7: Process */}
      <section id="process">
        <div className="wrap">
          <div className="sec-label reveal">合作流程</div>
          <h2 className="sec-title reveal reveal-d1">點樣合作？</h2>
          <p className="sec-sub reveal reveal-d2">5 個步驟，由 Idea 到交付，全程透明。</p>
          <div className="process-steps">
            {[
              { n: '1', t: '填寫需求表', d: '告訴我哋你想整乜。唔需要技術知識，用你自己的話講。', delay: 'reveal-d1' },
              { n: '2', t: '確認方向 + 報價', d: '我哋整理你的需求，釐清細節，出清晰報價。你 OK 先付款。', delay: 'reveal-d2' },
              { n: '3', t: '睇設計初稿', d: '設計出爐，你睇、你改（最多兩次），你確認先進入下一步。', delay: 'reveal-d3' },
              { n: '4', t: '開發 + 追蹤進度', d: '開發過程全透明。Dashboard 隨時睇到每個進度。', delay: 'reveal-d4' },
              { n: '5', t: '測試 + 交付', d: '你親自試用。有問題我哋修。你滿意先付尾款。', delay: '' },
            ].map((s, i) => (
              <div key={s.n} className={`step reveal ${s.delay}`}>
                <div className="step-num" style={i === 4 ? { background: 'rgba(245,197,24,0.1)', borderColor: 'rgba(245,197,24,.4)', color: 'var(--accent)' } : {}}>{s.n}</div>
                <div><div className="step-title">{s.t}</div><div className="step-desc">{s.d}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* S8: FAQ */}
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

      {/* S9: CTA + Footer */}
      <section id="cta">
        <div className="wrap">
          <div className="reveal"><div className="sec-label" style={{ textAlign: 'center' }}>準備好未？</div></div>
          <h2 className="cta-h reveal reveal-d1">準備好將你嘅 Idea<br />變成現實？</h2>
          <p className="cta-sub reveal reveal-d2">
            唔需要技術知識。<br />
            唔需要一次付清。<br />
            只需要告訴我哋你想要乜。
          </p>
          <div className="reveal reveal-d3">
            <a href={PORTAL_URL} className="btn btn-primary btn-xl">立即開始項目 →</a>
          </div>
          <div className="cta-tags reveal reveal-d4">
            {['由 HKD $3,000 起', '香港團隊直接負責', '做一 Part 計一 Part'].map(t => (
              <div key={t} className="cta-tag">{t}</div>
            ))}
          </div>
        </div>
        <div className="wrap">
          <div className="footer-bar">
            <span>© 2026 416 AI Studio</span>
            <span>香港製造 · PM 主導，交付為本</span>
            <a href={PORTAL_URL} style={{ color: 'var(--text-muted)' }}>Client Portal →</a>
          </div>
        </div>
      </section>
    </>
  )
}
