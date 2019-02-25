export default {
  rect: {
    id: 'rect',
    useHTMLString: `
    <path d="M1024 1024H64a64 64 0 0 1-64-64V64a64 64 0 0 1 64-64H1024z"/>
    <path transform="translate(1024 0)" d="M32 992V32h4403.52a32 32 0 0 1 32 32v896a32 32 0 0 1-32 32z" fill="#ffffff" />
    <path transform="translate(1024 0)" d="M4435.52 64v896H64V64h4371.52m0-64H0v1024h4435.52a64 64 0 0 0 64-64V64a64 64 0 0 0-64-64z" />
    `,
    attr: {
      'viewBox': '0 0 5523 1024'
    }
  }
}