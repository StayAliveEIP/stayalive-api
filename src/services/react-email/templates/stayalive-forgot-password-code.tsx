import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface VercelInviteUserEmailProps {
  username?: string;
  validationCode?: string;
  userImage?: string;
  inviteLink?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export const MailForgotPasswordCode = ({
  username = 'Bastos',
  validationCode = '144833',
}: VercelInviteUserEmailProps) => {
  const previewText = `Test`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src={`https://cdn.discordapp.com/attachments/1130401857890697285/1190320898281066607/logo_Background_Removed.png?ex=65a15fb9&is=658eeab9&hm=5991a47776a9e8fa888054f30446842827c32f051c28c8dbbaf494a510ce8ad5&`}
                width="80"
                height="80"
                alt="StayAlive"
                className="my-0 mx-auto p-0"
              />
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Reinitialisation du mot de passe
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]"></Text>
            <Text className="text-black text-[14px] text-center leading-[24px]">
              Bonjour {username}, vous avez oublier votre mot de passe ? voici
              votre code de validation :
            </Text>
            <Section style={codeContainer}>
              <Text style={code}>{validationCode}</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

const code = {
  color: '#000',
  display: 'inline-block',
  fontFamily: 'HelveticaNeue-Bold',
  fontSize: '32px',
  fontWeight: 700,
  letterSpacing: '6px',
  lineHeight: '40px',
  paddingBottom: '8px',
  paddingTop: '8px',
  margin: '0 auto',
  width: '100%',
  textAlign: 'center' as const,
};

const codeContainer = {
  background: 'rgba(0,0,0,.05)',
  borderRadius: '4px',
  margin: '16px auto 14px',
  verticalAlign: 'middle',
  width: '280px',
};
export default MailForgotPasswordCode;
