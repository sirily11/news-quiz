import {
  AppBar,
  Box,
  Button,
  Card,
  Dialog,
  IconButton,
  Pagination,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { GetServerSideProps } from "next";
import React from "react";
import Head from "next/head";
import { Quiz } from "../../lib/question";
import fs from "fs";
import path from "path";
import glob from "glob";
import YAML from "yaml";
import ReactMarkdown from "react-markdown";
import CloseIcon from "@mui/icons-material/Close";
import QuestionDialog from "../../lib/components/QuestionDialog";

interface Props {
  contents: string[];
  questions: Quiz[];
  title: string;
}

export default function Index({ title, contents, questions }: Props) {
  const [currentPage, setCurrentPage] = React.useState(0);
  const [showAnswer, setShowAnswer] = React.useState(false);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <AppBar elevation={0}>
        <Toolbar>
          <Typography textTransform={"capitalize"}>{title}</Typography>
        </Toolbar>
      </AppBar>
      <Stack p={2} spacing={1} mt={"52px"}>
        <ReactMarkdown>{contents[currentPage]}</ReactMarkdown>
        {contents.length > 1 && (
          <Pagination
            count={contents.length}
            onChange={(e, page) => setCurrentPage(page)}
          />
        )}
        <Box position={"fixed"} bottom={40} right={20}>
          <Button variant="outlined" onClick={() => setShowAnswer(true)}>
            Questions
          </Button>
        </Box>
        <QuestionDialog
          title={title}
          show={showAnswer}
          onClose={() => setShowAnswer(false)}
          questions={questions}
        />
      </Stack>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const { id } = context.query;
  const quizFolder = "quizzes";
  // check if folder exists
  const folder = path.join(process.cwd(), quizFolder, id as string);
  const exists = fs.existsSync(folder);
  if (!exists) {
    return {
      notFound: true,
    };
  }

  // get all markdown file
  const files = glob.sync(path.join(folder, "*.md"));
  const contents = files.map((file) => fs.readFileSync(file, "utf-8"));

  // get all questions
  const questionFiles = glob.sync(path.join(folder, "*.yaml"));
  const questions = questionFiles.map((file) => {
    const content = fs.readFileSync(file, "utf-8");
    return YAML.parse(content);
  });

  return {
    props: {
      contents,
      questions: questions[0],
      title: id as string,
    },
  };
};
