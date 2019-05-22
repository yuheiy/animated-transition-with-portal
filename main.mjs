import NProgress from 'https://dev.jspm.io/nprogress'

class PageTransition extends HTMLElement {
  connectedCallback() {
    const src = this.getAttribute('src')
    this.innerHTML = `
      <style>
        portal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
        }
        portal.enter {
          opacity: 1;
          transition: opacity .3s ease-out;
        }
      </style>
      <portal src="${src}"></portal>
    `

    const portalElement = this.querySelector('portal')
    portalElement.addEventListener('load', () => {
      this.dispatchEvent(new CustomEvent('load'))
    })
  }

  enter() {
    const portalElement = this.querySelector('portal')
    portalElement.addEventListener(
      'transitionend',
      () => {
        portalElement.activate()
      },
      { once: true },
    )
    portalElement.classList.add('enter')
  }
}

customElements.define('page-transition', PageTransition)

document.querySelectorAll('a').forEach((anchorElement) => {
  anchorElement.addEventListener('click', (event) => {
    const pageTransitionElement = document.createElement('page-transition')
    pageTransitionElement.setAttribute('src', event.currentTarget.href)
    pageTransitionElement.addEventListener('load', () => {
      getComputedStyle(pageTransitionElement) // force layout
      pageTransitionElement.enter()
      NProgress.done()
    })
    document.body.appendChild(pageTransitionElement)
    NProgress.start()
    event.preventDefault()
  })
})
