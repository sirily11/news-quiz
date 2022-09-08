import { Box, Stack, Typography } from "@mui/material";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <Box sx={{ background: "#795548", height: "100vh" }}>
      <Head>
        <title>Twinkle coffee</title>
      </Head>
      <Stack
        direction={"column"}
        justifyContent="center"
        alignContent={"center"}
        alignItems={"center"}
        height={"100%"}
      >
        <Box>
          <Image src={"/coffee.webp"} height={300} width={300} />
        </Box>
        <Typography color={"white"} fontSize={30} className={styles.homeTitle}>
          Coffee with Twinkle and Siri!
        </Typography>
      </Stack>
    </Box>
  );
};

export default Home;
