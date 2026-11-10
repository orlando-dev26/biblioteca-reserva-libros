// Ejemplos ficticios. Ejecutar con el backend iniciado: node datos-demo.mjs
const api = process.env.API_URL ?? 'http://localhost:8080/v1';
async function request(path, data) {
  const response = await fetch(`${api}/${path}`, data ? {
    method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data)
  } : undefined);
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status} ${await response.text()}`);
  return response.status === 201 ? null : response.json();
}
async function ensure(path, field, value) {
  let item = (await request(path)).find(item => item[field] === value[field]);
  if (!item) {
    await request(path, value);
    item = (await request(path)).find(item => item[field] === value[field]);
  }
  return item;
}
const literature = await ensure('categories','name',{name:'Literatura',description:'Novelas, relatos y obras de ficción.',state:true});
const technology = await ensure('categories','name',{name:'Tecnología',description:'Programación, ingeniería y herramientas digitales.',state:true});
const history = await ensure('categories','name',{name:'Historia',description:'Estudios y relatos sobre nuestra historia.',state:true});
const books = [];
for (const [title,author,isbn,available,idCategory] of [
  ['Cien años de soledad','Gabriel García Márquez','9780307474728',true,literature.idCategory],
  ['El principito','Antoine de Saint-Exupéry','9780156012195',true,literature.idCategory],
  ['Clean Code','Robert C. Martin','9780132350884',true,technology.idCategory],
  ['Historia del Perú contemporáneo','Carlos Contreras y Marcos Cueto','9789972516938',false,history.idCategory]
]) books.push(await ensure('books','isbn',{title,author,isbn,available,idCategory}));
const reader=await ensure('clients','cedula',{firstName:'Laura',lastName:'Mendoza',cedula:'DEMO-001',email:'laura@example.test'});
await ensure('clients','cedula',{firstName:'Diego',lastName:'Torres',cedula:'DEMO-002',email:'diego@example.test'});
if (!(await request(`reservations/client/${reader.idClient}`)).length) {
  const d=new Date(); const pad=n=>String(n).padStart(2,'0');
  const date=`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  await request('reservations',{idClient:reader.idClient,reservationDate:date,details:books.slice(0,2).map(b=>({idBook:b.idBook}))});
}
const reservations=await request('reservations');
console.log(JSON.stringify({message:'Ejemplos ficticios disponibles, sin sobrescribir registros existentes.',reservations:reservations.length,booksInFirstReservation:reservations[0]?.details.length},null,2));
