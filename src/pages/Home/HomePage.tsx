import { Link } from 'react-router-dom'
import styles from './HomePage.module.css'

const resources = [
  { icon: '⌘', title: 'Plano de estudos personalizado', text: 'A IA analisa seu perfil e cria um cronograma adaptado ao seu tempo e objetivos.' },
  { icon: 'ϟ', title: 'Chatbot para tirar dúvidas', text: 'Explique qualquer conteúdo, peça exemplos e tire dúvidas como se tivesse um professor ao seu lado.' },
  { icon: '▣', title: 'Questões e simulados', text: 'Banco com milhares de questões do ENEM, simulados completos e análise de desempenho.' },
  { icon: '◔', title: 'Progresso e ofensiva diária', text: 'Gamificação que te mantém motivado: XP, ofensivas, conquistas e ranking.' },
]

const testimonials = [
  { initials: 'AC', name: 'Ana Carolina', detail: 'São Paulo, SP', color: '#6c5ce7', text: '“Passei na USP depois de 6 meses usando o AdaptAI. O plano personalizado fez toda a diferença.”' },
  { initials: 'PH', name: 'Pedro Henrique', detail: 'Fortaleza, CE', color: '#3486e7', text: '“Nunca tive dinheiro para cursinho. O AdaptAI me deu acesso ao mesmo nível de preparação.”' },
  { initials: 'ML', name: 'Mariana Lima', detail: 'Recife, PE', color: '#10bd98', text: '“A IA identificou meus pontos fracos em Matemática e em 2 meses minha nota subiu 80 pontos.”' },
]

function Brand() {
  return <span className={styles.brand}><img src="/favicon.svg" alt="" /> <span>AdaptAI</span></span>
}

export function HomePage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link to="/" aria-label="AdaptAI - início"><Brand /></Link>
        <nav className={styles.nav} aria-label="Navegação principal">
          <a href="#como-funciona">Como funciona</a><a href="#recursos">Matérias</a><a href="#depoimentos">Depoimentos</a>
        </nav>
        <div className={styles.headerActions}><Link to="/login" className={styles.login}>Entrar</Link><Link to="/cadastro" className={styles.smallCta}>Começar grátis</Link></div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>★&nbsp; Plataforma gratuita para estudantes brasileiros</span>
            <h1>Seu cursinho inteligente<br />para estudar para o<br /><em>ENEM de graça.</em></h1>
            <p>Organize seus estudos, tire dúvidas com IA e acompanhe seu progresso em uma plataforma feita para estudantes brasileiros.</p>
            <div className={styles.heroActions}><Link className={styles.primaryButton} to="/cadastro">Começar agora <span>→</span></Link><a className={styles.secondaryButton} href="#como-funciona">Ver como funciona</a></div>
            <div className={styles.students}><span className={styles.faces}><b>A</b><b>P</b><b>M</b><b>J</b></span><strong>+1000</strong> estudantes já usam</div>
          </div>
          <div className={styles.heroArt}><img src="/banner.png" alt="Estudante estudando com a inteligência artificial do AdaptAI" /></div>
        </div>
      </section>

      <section className={styles.stats} aria-label="Resultados"><div><strong>1k+</strong><span>Estudantes ativos</span></div><div><strong>98%</strong><span>melhoraram no ENEM</span></div><div><strong>4.9★</strong><span>Avaliação média</span></div><div><strong>Grátis</strong><span>Para sempre</span></div></section>

      <section className={styles.features} id="recursos">
        <div className={styles.sectionIntro}><h2>Como o AdaptAI ajuda você</h2><p>Tudo que você precisa para se preparar para o ENEM em um só lugar, de graça.</p></div>
        <div className={styles.featureGrid}>{resources.map((resource) => <article className={styles.featureCard} key={resource.title}><span className={styles.featureIcon}>{resource.icon}</span><h3>{resource.title}</h3><p>{resource.text}</p></article>)}</div>
      </section>

      <section className={styles.dashboardSection} id="como-funciona"><div className={styles.dashboardInner}><div className={styles.dashboardCopy}><h2>Tudo organizado no seu dashboard</h2><p>Veja seu progresso, plano do dia, ofensiva e dicas da IA em uma tela só. Simples, visual e motivador.</p><ul><li>Plano de estudos personalizado pela IA</li><li>Ofensiva e XP para manter o ritmo</li><li>Gráficos de evolução por matéria</li><li>Dicas diárias baseadas nos seus erros</li></ul><Link to="/cadastro" className={styles.dashboardCta}>Acessar meu dashboard <span>→</span></Link></div><div className={styles.dashboardPreview}><img src="/preview.png" alt="Preview do dashboard AdaptAI com plano de estudos, progresso e metas" /></div></div></section>

      <section className={styles.mission}><span className={styles.missionIcon}>♧</span><h2>Educação de qualidade não deveria depender<br />de quanto você pode pagar.</h2><p>O AdaptAI nasceu para democratizar o acesso à preparação para o ENEM. Estudantes de<br />escola pública, de cidades pequenas, de famílias sem renda para cursinho — todos merecem a mesma chance.</p></section>

      <section className={styles.testimonials} id="depoimentos"><h2>Quem já usa o AdaptAI</h2><div className={styles.testimonialGrid}>{testimonials.map((item) => <article className={styles.testimonial} key={item.name}><div className={styles.person}><span style={{ background: item.color }}>{item.initials}</span><div><strong>{item.name}</strong><small>{item.detail}</small></div></div><div className={styles.stars}>★★★★★</div><p>{item.text}</p></article>)}</div></section>

      <section className={styles.finalSection}><div className={styles.finalCta}><span>♧</span><h2>Comece sua jornada hoje.</h2><p>Crie sua conta grátis, monte seu plano de estudos e estude do seu jeito.<br />A IA se adapta a você.</p><Link to="/cadastro">Criar conta grátis <b>→</b></Link><small>Sem cartão de crédito. Sem pegadinha. 100% gratuito.</small></div></section>
      <footer className={styles.footer}><Brand /><span>© 2025 AdaptAI · Educação acessível para todos os brasileiros</span></footer>
    </main>
  )
}
