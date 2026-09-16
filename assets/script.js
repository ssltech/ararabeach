const ACCESS_KEY='araraBeachDemoAccess';
const ACCESS_HASH='2db3b44083d89e574851d1e7ff7c0f08f3a0f3bde3f9c4276968bbef130eda13';

const unlockSite=()=>{
  document.body.classList.remove('access-locked');
  document.body.classList.add('access-unlocked');
  document.querySelector('#accessGate')?.setAttribute('aria-hidden','true');
};

const hashPassword=async value=>{
  const data=new TextEncoder().encode(value);
  const digest=await crypto.subtle.digest('SHA-256',data);
  return [...new Uint8Array(digest)].map(byte=>byte.toString(16).padStart(2,'0')).join('');
};

if(sessionStorage.getItem(ACCESS_KEY)==='granted'){
  unlockSite();
}

const accessForm=document.querySelector('#accessForm');
const accessPassword=document.querySelector('#accessPassword');
const accessError=document.querySelector('#accessError');
const accessField=document.querySelector('.access-field');
const passwordToggle=document.querySelector('#passwordToggle');

passwordToggle?.addEventListener('click',()=>{
  const show=accessPassword.type==='password';
  accessPassword.type=show?'text':'password';
  passwordToggle.textContent=show?'Ocultar':'Mostrar';
  passwordToggle.setAttribute('aria-label',show?'Ocultar senha':'Mostrar senha');
  accessPassword.focus();
});

accessForm?.addEventListener('submit',async event=>{
  event.preventDefault();
  const submit=accessForm.querySelector('[type="submit"]');
  const value=accessPassword.value.trim();
  accessError.textContent='';
  if(!value){
    accessError.textContent='Digite a senha para continuar.';
    accessPassword.focus();
    return;
  }
  submit.disabled=true;
  submit.firstChild.textContent='Verificando... ';
  const valid=await hashPassword(value)===ACCESS_HASH;
  submit.disabled=false;
  submit.firstChild.textContent='Liberar demonstração ';
  if(valid){
    sessionStorage.setItem(ACCESS_KEY,'granted');
    unlockSite();
    document.querySelector('#inicio')?.focus({preventScroll:true});
    return;
  }
  accessError.textContent='Senha incorreta. Verifique e tente novamente.';
  accessPassword.select();
  accessField.classList.remove('shake');
  requestAnimationFrame(()=>accessField.classList.add('shake'));
});

const toggle=document.querySelector('.menu-toggle');
const menu=document.querySelector('#menu');
toggle?.addEventListener('click',()=>{
  const open=menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded',String(open));
});
menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  menu.classList.remove('open');
  toggle?.setAttribute('aria-expanded','false');
}));
document.querySelector('#year').textContent=new Date().getFullYear();
document.querySelector('[data-contact]')?.addEventListener('click',event=>{
  if(event.currentTarget.getAttribute('href')==='#'){
    event.preventDefault();
    document.querySelector('[data-contact]').nextElementSibling?.scrollIntoView({behavior:'smooth',block:'center'});
  }
});
