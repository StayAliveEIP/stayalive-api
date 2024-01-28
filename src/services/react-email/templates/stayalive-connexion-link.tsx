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

interface MagicLinkEmailProps {
  username?: string;
  validationCode?: string;
  authLink?: string;
}

export const MagicLinkMail = ({
  username = 'Erreur',
  authLink = 'https://stayalive.fr',
}: MagicLinkEmailProps) => {
  const previewText = `Lien de connexion`;

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
              Lien de connexion
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]"></Text>
            <Text className="text-black text-[14px] text-center leading-[24px]">
              Bonjour {username}, vous pouvez vous connecter en cliquant sur le
              lien ci dessous.
            </Text>
            <Section style={codeContainer}>
              <Button
                className="text-white text-[14px] text-center leading-[24px] w-full my-[16px] mx-0"
                href={authLink}
              >
                Me connecter
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
export default MagicLinkMail;
