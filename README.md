Projeto Sistema de Agendamentos - Integrado com MongoDB Atlas

Instruções rápidas:
1) Extraia o ZIP
2) Instale dependências:
   npm install
3) Inicie o servidor:
   npm run dev   (recomendado, usa nodemon)
   ou
   npm start
4) Abra os arquivos HTML no navegador:
   - login.html
   - Administrador.html
   - professor.html
   - Tecnico.html

Observações:
- O backend roda em http://localhost:3000
- O frontend se conecta ao backend via fetch em API_BASE = 'http://localhost:3000'
- As páginas foram modificadas para sincronizar com o servidor ao carregar e para enviar novas criações (usuário, material, problema, agendamento) ao servidor.
