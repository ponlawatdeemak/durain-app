import { useEffect } from 'react';
import { GetServerSideProps, InferGetStaticPropsType, NextPage } from 'next';
import Image from "next/image";
// import { useRouter } from 'next/router';
import { Profile } from 'next-auth';
import { signIn, signOut, useSession } from 'next-auth/react';
import { UserConfig, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18NextConfig from '../next-i18next.config.js';

import { Box, Button, Divider, Grid } from '@mui/material';

import PageContainer from '@/components/PageContainer';
import UserAvatar from '@/components/UserAvatar';
import styles from "@/styles/Home.module.css";

import axios from 'axios';
import OpenidConfiguration from '@/models/OpenidConfiguration.js';
import { DEFAULT_LOCALE, NEXTAUTH_PROVIDER_ID } from "../webapp.config";

export const getServerSideProps: GetServerSideProps = async (context) => ({
  props: {
    ...(await serverSideTranslations( context.locale ?? DEFAULT_LOCALE, ['common'], nextI18NextConfig as UserConfig)),
  },
});

// const HomePage: NextPage = (_props: InferGetStaticPropsType<typeof getServerSideProps>) => {
export default function HomePage(_props: InferGetStaticPropsType<typeof getServerSideProps>) {
  // const router = useRouter();
  const { t } = useTranslation("common");

  const { data: authSession, status } = useSession();
  const user = authSession?.user;
  // const role = authSession?.user?.role;

  return (
    <PageContainer requireLogin={false}>

      <Grid  sx={{mt: 2}}>
      <Grid container item xs={12} justifyContent={"center"}>
        { user ? 
          <Box><UserAvatar user={user as Profile} size="large" /> <Button variant='contained' onClick={async () => {
            signOut({ redirect: false }).then(() => {
              // redirect to clear login session on SSO web
              axios.get(`${process.env.COGNITO_WELLKNOWN}`)
              .then((response) => {
                const cognitoWellKnown: OpenidConfiguration = response.data;
                const logoutEndpoint = `${cognitoWellKnown.end_session_endpoint}?client_id=${process.env.COGNITO_CLIENT_ID}&logout_uri=${window.location.href}`;
                window.location.href = logoutEndpoint;
              })
              .catch((error) => {
                console.log(error);
              });
            });
          }}>{t("LOGOUT")}</Button></Box> 
          : <Button variant='contained' onClick={() => signIn(NEXTAUTH_PROVIDER_ID)}>{t("LOGIN")}</Button>
        }
      </Grid>
      <Grid item xs={12}>
      <Divider sx={{p: 1}} />
      
      <main className={`${styles.main}`}>
        <div className={styles.description}>
          <p>
            Get started by editing&nbsp;
            <code className={styles.code}>pages/index.tsx</code>
          </p>
          <div>
            <a
              href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              By{" "}
              <Image
                src="/vercel.svg"
                alt="Vercel Logo"
                className={styles.vercelLogo}
                width={100}
                height={24}
                priority
              />
            </a>
          </div>
        </div>

        <div className={styles.center}>
          <Image
            className={styles.logo}
            src="/next.svg"
            alt="Next.js Logo"
            width={180}
            height={37}
            priority
          />
        </div>

        <div className={styles.grid}>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              Docs <span>-&gt;</span>
            </h2>
            <p>
              Find in-depth information about Next.js features and&nbsp;API.
            </p>
          </a>

          <a
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              Learn <span>-&gt;</span>
            </h2>
            <p>
              Learn about Next.js in an interactive course with&nbsp;quizzes!
            </p>
          </a>

          <a
            href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              Templates <span>-&gt;</span>
            </h2>
            <p>
              Discover and deploy boilerplate example Next.js&nbsp;projects.
            </p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              Deploy <span>-&gt;</span>
            </h2>
            <p>
              Instantly deploy your Next.js site to a shareable URL
              with&nbsp;Vercel.
            </p>
          </a>
        </div>
      </main>

      </Grid>
      </Grid>
    </PageContainer>
  );
}
