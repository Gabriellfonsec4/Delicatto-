const products=[
  {name:'Bolo de praliné',category:'bolos',image:'bolo-praline.webp',alt:'Bolo de chocolate com cobertura brilhante, praliné crocante e cereja'},
  {name:'Red velvet',category:'bolos',image:'red-velvet.webp',alt:'Bolo red velvet com creme claro e cerejas'},
  {name:'Rosetas de brigadeiro',category:'bolos',image:'bolo-rosetas.webp',alt:'Bolo decorado com rosetas de brigadeiro e creme'},
  {name:'Brigadeiros de festa',category:'doces',image:'brigadeiros-coloridos.webp',alt:'Sortimento de brigadeiros coloridos em forminhas'},
  {name:'Brigadeiros especiais',category:'doces',image:'brigadeiros-fin-os.webp',alt:'Brigadeiros variados com coberturas de castanhas e pistache'},
  {name:'Bombom de pistache',category:'doces',image:'bombom-pistache.webp',alt:'Bombom de pistache com morango cortado ao meio'},
  {name:'Bolo chocolatudo',category:'bolos',image:'bolo-chocolate.webp',alt:'Bolo coberto com chocolate, morangos e pedaços de chocolate branco'},
  {name:'Bolo floral',category:'bolos',image:'bolo-floral.webp',alt:'Bolo branco decorado com flores em tons de rosa'},
  {name:'Crème brûlée com doce de leite',category:'bolos',image:'bolo-brulee.webp',alt:'Bolo com creme brûlée e doce de leite em base dourada'},
  {name:'Bolo vintage',category:'bolos',image:'bolo-vintage.webp',alt:'Bolo vintage branco com cerejas e acabamento de chantilly'}
];

const gallery=document.querySelector('#gallery');
const modal=document.querySelector('#lightbox');
const modalImg=document.querySelector('#lightbox-img');
const modalTitle=document.querySelector('#lightbox-title');
const modalNumber=document.querySelector('#lightbox-number');
const modalOrder=document.querySelector('#lightbox-order');
let visible=[...products],current=0,lastFocus=null;

function orderLink(name){
  return 'https://wa.me/5512981015011?text='+encodeURIComponent(`Olá, Bruna! Vi ${name} no site e gostaria de saber sobre uma encomenda.`);
}

function render(filter='todos'){
  visible=products.filter(p=>filter==='todos'||p.category===filter);
  gallery.replaceChildren();
  visible.forEach((p,i)=>{
    const b=document.createElement('button');
    b.className='gallery-item';
    b.type='button';
    b.setAttribute('aria-label',`Ampliar imagem de ${p.name}`);
    const img=document.createElement('img');
    img.src='img/'+p.image;
    img.alt=p.alt;
    img.loading=i<3?'eager':'lazy';
    const label=document.createElement('span');
    label.className='gallery-info';
    label.innerHTML=`<span><small>${p.category==='bolos'?'Bolos':'Doces'} · Delicatto</small>${p.name}</span><b class="gallery-plus" aria-hidden="true"></b>`;
    b.append(img,label);
    b.addEventListener('click',()=>{
      visible=products.filter(item=>filter==='todos'||item.category===filter);
      openModal(i);
    });
    gallery.append(b);
  });
}

function show(i){
  current=(i+visible.length)%visible.length;
  const p=visible[current];
  modalImg.src='img/'+p.image;
  modalImg.alt=p.alt;
  modalTitle.textContent=p.name;
  modalNumber.textContent=String(current+1).padStart(2,'0')+' / '+String(visible.length).padStart(2,'0');
  modalOrder.href=orderLink(p.name);
}

function openModal(i){
  lastFocus=document.activeElement;
  show(i);
  modal.hidden=false;
  document.body.classList.add('lock');
  modal.querySelector('.lightbox-close').focus();
}

function closeModal(){
  modal.hidden=true;
  document.body.classList.remove('lock');
  modalImg.src='';
  lastFocus?.focus();
}

document.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.filter').forEach(x=>{
    x.classList.remove('active');
    x.setAttribute('aria-pressed','false');
  });
  b.classList.add('active');
  b.setAttribute('aria-pressed','true');
  render(b.dataset.filter);
}));

modal.querySelector('.lightbox-close').addEventListener('click',closeModal);
modal.querySelector('.prev').addEventListener('click',()=>show(current-1));
modal.querySelector('.next').addEventListener('click',()=>show(current+1));
modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});

document.addEventListener('keydown',e=>{
  if(modal.hidden)return;
  if(e.key==='Escape')closeModal();
  if(e.key==='ArrowRight')show(current+1);
  if(e.key==='ArrowLeft')show(current-1);
  if(e.key==='Tab'){
    const controls=[...modal.querySelectorAll('button,a')];
    const first=controls[0],last=controls.at(-1);
    if(e.shiftKey&&document.activeElement===first){
      e.preventDefault();
      last.focus();
    }else if(!e.shiftKey&&document.activeElement===last){
      e.preventDefault();
      first.focus();
    }
  }
});

let touchX=0;
modal.addEventListener('touchstart',e=>touchX=e.changedTouches[0].screenX,{passive:true});
modal.addEventListener('touchend',e=>{
  const diff=e.changedTouches[0].screenX-touchX;
  if(Math.abs(diff)>55)show(current+(diff<0?1:-1));
},{passive:true});

const menuButton=document.querySelector('.menu-toggle');
const menu=document.querySelector('#menu');
menuButton.addEventListener('click',()=>{
  const open=menu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded',String(open));
  menuButton.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');
});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  menu.classList.remove('open');
  menuButton.setAttribute('aria-expanded','false');
}));
document.querySelector('#year').textContent=new Date().getFullYear();
render();

const easterProducts=[
  {name:'Chocolate com avelã',image:'pascoa-avela.webp',alt:'Ovo de chocolate com avelã e bombons'},
  {name:'Pistache e frutas vermelhas',image:'pascoa-pistache.webp',alt:'Ovo de Páscoa trufado de pistache com frutas vermelhas'},
  {name:'Chocolate belga ao leite',image:'pascoa-belga.webp',alt:'Ovo de Páscoa recheado com brigadeiro de chocolate'}
];

document.querySelectorAll('[data-easter]').forEach(button=>button.addEventListener('click',()=>{
  const index=Number(button.dataset.easter);
  visible=easterProducts;
  openModal(index);
}));

const suggestions={
  aniversario:{
    title:'Bolo para celebrar',
    description:'Um bolo para ser o centro da mesa e marcar a comemoração.',
    message:'Olá, Bruna! Estou planejando um aniversário e gostaria de conversar sobre um bolo.'
  },
  presente:{
    title:'Doces para presentear',
    description:'Um gesto de carinho que chega em forma de doce.',
    message:'Olá, Bruna! Gostaria de uma sugestão de doces para presentear.'
  },
  pascoa:{
    title:'Criações de Páscoa',
    description:'Chocolate e recheios para compartilhar uma data especial.',
    message:'Olá, Bruna! Vi as criações de Páscoa no site e gostaria de saber sobre disponibilidade e valores.'
  },
  encontro:{
    title:'Brigadeiros para compartilhar',
    description:'Os clássicos que deixam qualquer encontro mais gostoso.',
    message:'Olá, Bruna! Gostaria de conversar sobre brigadeiros para um encontro.'
  }
};

function setSuggestion(key){
  const suggestion=suggestions[key];
  document.querySelectorAll('.choice').forEach(button=>{
    const active=button.dataset.choice===key;
    button.classList.toggle('active',active);
    button.setAttribute('aria-pressed',String(active));
  });
  document.querySelector('#choice-title').textContent=suggestion.title;
  document.querySelector('#choice-description').textContent=suggestion.description;
  document.querySelector('#choice-link').href='https://wa.me/5512981015011?text='+encodeURIComponent(suggestion.message);
}

document.querySelectorAll('.choice').forEach(button=>button.addEventListener('click',()=>setSuggestion(button.dataset.choice)));
setSuggestion('aniversario');

const catalogItems={
  bolos:[
    {name:'Bolo de praliné',image:'bolo-praline.webp',detail:'Chocolate e crocância para celebrar.',price:'R$ 149,90'},
    {name:'Bolo floral',image:'bolo-floral.webp',detail:'Acabamento delicado para um momento especial.',price:'R$ 159,90'},
    {name:'Crème brûlée',image:'bolo-brulee.webp',detail:'Uma inspiração com doce de leite.',price:'R$ 139,90'}
  ],
  doces:[
    {name:'Brigadeiros de festa',image:'brigadeiros-coloridos.webp',detail:'Sugestão de caixa para compartilhar.',price:'R$ 49,90'},
    {name:'Brigadeiros especiais',image:'brigadeiros-fin-os.webp',detail:'Variedade de sabores e coberturas.',price:'R$ 69,90'},
    {name:'Bombom de pistache',image:'bombom-pistache.webp',detail:'Chocolate, pistache e morango.',price:'R$ 24,90'}
  ],
  pascoa:[
    {name:'Chocolate com avelã',image:'pascoa-avela.webp',detail:'Uma inspiração para a Páscoa.',price:'R$ 89,90'},
    {name:'Pistache e frutas vermelhas',image:'pascoa-pistache.webp',detail:'Recheio cremoso e frutas vermelhas.',price:'R$ 109,90'},
    {name:'Chocolate belga ao leite',image:'pascoa-belga.webp',detail:'Para quem ama chocolate intenso.',price:'R$ 94,90'}
  ]
};

const catalogGrid=document.querySelector('#catalog-grid');

function renderCatalog(category){
  catalogGrid.replaceChildren();
  catalogItems[category].forEach(item=>{
    const article=document.createElement('article');
    article.className='catalog-card';
    const photo=document.createElement('img');
    photo.src='img/'+item.image;
    photo.alt=item.name;
    photo.loading='lazy';
    const content=document.createElement('div');
    content.className='catalog-card-content';
    const label=document.createElement('span');
    label.className='catalog-demo';
    label.textContent='PREÇO FICTÍCIO';
    const title=document.createElement('h3');
    title.textContent=item.name;
    const detail=document.createElement('p');
    detail.textContent=item.detail;
    const price=document.createElement('strong');
    price.className='catalog-price';
    price.textContent=item.price;
    const link=document.createElement('a');
    link.textContent='Consultar valor real';
    link.target='_blank';
    link.rel='noopener';
    link.href='https://wa.me/5512981015011?text='+encodeURIComponent(`Olá, Bruna! Vi ${item.name} no catálogo demonstrativo do site. Você pode me informar o valor real e as opções disponíveis?`);
    content.append(label,title,detail,price,link);
    article.append(photo,content);
    catalogGrid.append(article);
  });
  document.querySelectorAll('.catalog-tab').forEach(button=>{
    const active=button.dataset.catalog===category;
    button.classList.toggle('active',active);
    button.setAttribute('aria-pressed',String(active));
  });
}

document.querySelectorAll('.catalog-tab').forEach(button=>button.addEventListener('click',()=>renderCatalog(button.dataset.catalog)));
renderCatalog('bolos');