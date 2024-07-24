# Split Money

## Descrição

O **Split Money** é uma aplicação de controle financeiro que permite cadastrar transações com informações de entradas e saídas de dinheiro. Você pode informar o tipo do gasto, valor, data e nome, além de poder cadastrar transações recorrentes. O sistema também conta com um dashboard com informações dos últimos gastos, lançamentos e filtros por mês.

## Tecnologias Utilizadas

- **Next.js**: Framework React para renderização do lado do servidor e geração de sites estáticos.
- **TypeScript**: Linguagem que adiciona tipagem estática ao JavaScript.
- **React**: Biblioteca para construção de interfaces de usuário.
- **Tailwind CSS**: Framework de CSS utilitário para estilização rápida e personalizada.
- **Ant Design**: Biblioteca de componentes React para interfaces de usuário com design sofisticado.
- **React Query**: Biblioteca para gerenciamento e sincronização de estados de servidor.
- **Day.js** e **Moment.js**: Bibliotecas para manipulação de datas.
- **Axios**: Biblioteca para fazer requisições HTTP.
- **JWT**: JSON Web Token para autenticação e autorização.
- **Zod**: Biblioteca para validação de esquemas e tipos.

## Instalação

Para instalar e configurar o projeto localmente, siga os passos abaixo:

1. Clone o repositório:
   ```bash
   git clone https://github.com/Cavalheiro-S/split-money.git
   ```

2. Navegue até o diretório do projeto:
   ```bash
   cd split-money
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

## Configuração

Antes de executar o projeto, configure as variáveis de ambiente necessárias. Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis (substitua pelos valores corretos):

```env
NEXT_PUBLIC_BACKEND_URL=your_database_url
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_jwt_secret
```

## Uso

Para iniciar o servidor de desenvolvimento, execute:

```bash
npm run dev
```

Para construir o projeto para produção, execute:

```bash
npm run build
```

Para iniciar o servidor em produção, execute:

```bash
npm run start
```

## Contribuição

Contribuições são bem-vindas! Para contribuir com o projeto:

1. Faça um fork do repositório.
2. Crie uma branch para sua feature:
   ```bash
   git checkout -b minha-feature
   ```
3. Faça as mudanças e commit:
   ```bash
   git commit -am 'Adiciona nova feature'
   ```
4. Envie para o repositório remoto:
   ```bash
   git push origin minha-feature
   ```
5. Abra um pull request.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

## Contato

Para questões ou suporte, entre em contato com [luccribeiro53@gmail.com](mailto:luccribeiro53@gmail.com).
