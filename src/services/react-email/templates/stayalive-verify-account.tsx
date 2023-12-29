import {
  Body,
  Button,
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

export const VerifyAccountEmail = ({
  username = 'Bastos',
  inviteLink = 'https://vercel.com/teams/invite/foo',
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
              Verifiez votre compte
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]"></Text>
            <Text className="text-black text-[14px] text-center leading-[24px]">
              Bonjour {username}, verifiez votre compte en cliquant sur le
              bouton ci-dessous.
            </Text>
            <Section style={codeContainer}>
              <Button
                className="text-white text-[14px] text-center leading-[24px] w-full my-[16px] mx-0"
                href={inviteLink}
              >
                Verifier mon compte
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

const codeContainer = {
  background: 'red',
  borderRadius: '5px',
  margin: '16px auto 14px',
  verticalAlign: 'middle',
  width: '280px',
};
export default VerifyAccountEmail;
