import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade - Split Money",
  description: "Política de Privacidade do aplicativo Split Money",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl prose prose-neutral dark:prose-invert">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Política de Privacidade
        </h1>
        <p className="text-muted-foreground mb-8">
          Última atualização: 04 de abril de 2026
        </p>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">1. Introdução</h2>
          <p>
            O <strong>Split Money</strong> é um aplicativo de gerenciamento de
            despesas pessoais. Esta Política de Privacidade descreve como
            coletamos, usamos, armazenamos e protegemos suas informações quando
            você utiliza nosso aplicativo, incluindo funcionalidades integradas
            ao WhatsApp por meio da API do WhatsApp Business da Meta.
          </p>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-xl font-semibold">2. Dados que coletamos</h2>
          <p>Podemos coletar os seguintes tipos de dados:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Dados de cadastro:</strong> nome, endereço de e-mail e
              senha (armazenada de forma criptografada).
            </li>
            <li>
              <strong>Dados financeiros inseridos por você:</strong> transações,
              categorias, tags e status de pagamento que você registra no
              aplicativo.
            </li>
            <li>
              <strong>Dados de uso:</strong> informações sobre como você interage
              com o aplicativo, como páginas acessadas e funcionalidades
              utilizadas.
            </li>
            <li>
              <strong>Dados do WhatsApp:</strong> ao utilizar a integração com o
              WhatsApp, podemos receber seu número de telefone e o conteúdo das
              mensagens trocadas com o aplicativo para processar suas
              solicitações.
            </li>
          </ul>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-xl font-semibold">
            3. Como usamos seus dados
          </h2>
          <p>Utilizamos seus dados para:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Fornecer e manter o funcionamento do aplicativo.</li>
            <li>
              Processar e exibir suas transações financeiras e relatórios.
            </li>
            <li>
              Enviar notificações e interagir com você via WhatsApp, quando
              autorizado.
            </li>
            <li>Melhorar a experiência do usuário e o desempenho do aplicativo.</li>
            <li>Garantir a segurança da sua conta.</li>
          </ul>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-xl font-semibold">
            4. Compartilhamento de dados com terceiros
          </h2>
          <p>
            Não vendemos seus dados pessoais. Podemos compartilhar informações
            com os seguintes provedores de serviço, exclusivamente para o
            funcionamento do aplicativo:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Amazon Web Services (AWS Cognito):</strong> para
              autenticação e gerenciamento de contas de usuário.
            </li>
            <li>
              <strong>Meta (WhatsApp Business API):</strong> para possibilitar a
              comunicação via WhatsApp. O uso dos dados pela Meta é regido pela{" "}
              <a
                href="https://www.whatsapp.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Política de Privacidade do WhatsApp
              </a>
              .
            </li>
            <li>
              <strong>Sentry:</strong> para monitoramento de erros e estabilidade
              do aplicativo.
            </li>
            <li>
              <strong>Microsoft Clarity:</strong> para análise de uso e melhoria
              da experiência do usuário.
            </li>
          </ul>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-xl font-semibold">
            5. Armazenamento e segurança
          </h2>
          <p>
            Seus dados são armazenados em servidores seguros e protegidos por
            medidas técnicas e organizacionais adequadas, incluindo:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Criptografia de senhas.</li>
            <li>Tokens de autenticação seguros (JWT) com validade limitada.</li>
            <li>Comunicação via HTTPS.</li>
          </ul>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-xl font-semibold">
            6. Seus direitos
          </h2>
          <p>
            Em conformidade com a Lei Geral de Proteção de Dados (LGPD), você
            tem direito a:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Acessar seus dados pessoais.</li>
            <li>Corrigir dados incompletos ou desatualizados.</li>
            <li>Solicitar a exclusão dos seus dados pessoais.</li>
            <li>Revogar o consentimento para o tratamento de dados.</li>
            <li>
              Solicitar informações sobre o compartilhamento dos seus dados.
            </li>
          </ul>
          <p>
            Para exercer qualquer um desses direitos, entre em contato conosco
            pelo e-mail indicado abaixo.
          </p>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-xl font-semibold">
            7. Integração com o WhatsApp
          </h2>
          <p>
            Ao utilizar as funcionalidades do Split Money via WhatsApp, você
            concorda que:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Seu número de telefone será usado para identificá-lo e comunicar-se
              com você.
            </li>
            <li>
              As mensagens enviadas e recebidas poderão ser processadas para
              executar as funcionalidades solicitadas (como registrar transações).
            </li>
            <li>
              Não armazenamos o conteúdo das mensagens além do necessário para
              processar sua solicitação.
            </li>
          </ul>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-xl font-semibold">
            8. Alterações nesta política
          </h2>
          <p>
            Podemos atualizar esta Política de Privacidade periodicamente. Em
            caso de alterações significativas, notificaremos você por meio do
            aplicativo ou por e-mail. Recomendamos que revise esta página
            regularmente.
          </p>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-xl font-semibold">9. Contato</h2>
          <p>
            Se você tiver dúvidas sobre esta Política de Privacidade ou sobre o
            tratamento dos seus dados, entre em contato:
          </p>
          <p>
            <strong>E-mail:</strong>{" "}
            <a
              href="mailto:luccribeiro53@gmail.com"
              className="text-primary underline"
            >
              luccribeiro53@gmail.com
            </a>
          </p>
        </section>
      </article>
    </main>
  );
}
