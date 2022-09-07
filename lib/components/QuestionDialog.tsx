import {
  Alert,
  AppBar,
  Button,
  Card,
  Checkbox,
  Container,
  Dialog,
  FormControlLabel,
  FormGroup,
  IconButton,
  Radio,
  RadioGroup,
  Slide,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { createRef } from "react";
import { Quiz, Type } from "../question";
//@ts-ignore
import { useScreenshot, createFileName } from "use-react-screenshot";
import { TransitionProps } from "@mui/material/transitions";

interface Props {
  title: string;
  questions: Quiz[];
  onClose(): void;
  show: boolean;
}

interface Message {
  message: string;
  severity: "error" | "success" | "info";
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// promise based sleep function
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function QuestionDialog(props: Props) {
  const ref = createRef();
  const [questions, setQuestions] = React.useState(props.questions);
  const [isEditable, setIsEditable] = React.useState(true);
  const [image, takeScreenshot] = useScreenshot();
  const getImage = () => takeScreenshot(ref.current).then(download);
  const download = (
    image: any,
    { name = props.title, extension = "jpg" } = {}
  ) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = createFileName(extension, name);
    a.click();
  };

  const onSubmit = React.useCallback(async () => {
    if (isEditable) {
      setIsEditable(false);
      return;
    }
    getImage();
  }, [image, questions]);

  return (
    <Dialog
      open={props.show}
      onClose={props.onClose}
      fullScreen
      TransitionComponent={Transition}
    >
      <AppBar elevation={0} sx={{ position: "fixed" }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={props.onClose}>
            <CloseIcon color="inherit" />
          </IconButton>
          <Typography>Questions</Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Stack p={2} spacing={2} ref={ref} mt={8}>
          {questions.map((question, index) => (
            <QuestionDisplay
              key={index}
              index={index}
              question={question}
              isEditable={isEditable}
              updateQuestion={(question) => {
                questions[index] = question;
                setQuestions([...questions]);
              }}
            />
          ))}

          <Button
            variant="contained"
            onClick={() => {
              onSubmit();
            }}
          >
            {isEditable ? "Submit" : "Download screenshot"}
          </Button>
        </Stack>
      </Container>
    </Dialog>
  );
}

interface QuestionDisplayProps {
  index: number;
  question: Quiz;
  updateQuestion: (question: Quiz, index: number) => void;
  isEditable: boolean;
}

function QuestionDisplay(props: QuestionDisplayProps) {
  const renderQuestionArea = React.useCallback(() => {
    if (props.question.type === Type.Multiselect) {
      return <MultiselectQuestion {...props} />;
    }

    if (props.question.type === Type.Text) {
      return <TextQuestion {...props} />;
    }

    if (props.question.type === Type.Select) {
      return <SelectQuestion {...props} />;
    }
  }, [props.question, props.isEditable]);

  const answerMessage: Message = React.useMemo(() => {
    if (props.question.type === Type.Text) {
      return {
        message: props.question.explanation!,
        severity: "info",
      };
    }

    const correctAnswers = props.question.choices?.filter(
      (c) => c.checked && c.correct
    );

    if (correctAnswers?.length === 0) {
      return {
        message: `Incorrect answer, the correct answer is: ${props.question.choices
          ?.filter((c) => c.correct)
          .reduce((acc, curr) => acc + ", " + curr.title, "")}. ${
          props.question.explanation
        }`,
        severity: "error",
      };
    }
    return {
      message: "correct",
      severity: "success",
    };
  }, [props.question, props.isEditable]);

  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h6" gutterBottom>
          {props.index + 1}. {props.question.title}
        </Typography>
        {props.question.hint && props.isEditable && (
          <Alert severity="info">Hint: {props.question.hint}</Alert>
        )}

        {!props.isEditable && (
          <Alert severity={answerMessage.severity}>
            {answerMessage.message}
          </Alert>
        )}
        {renderQuestionArea()}
      </Stack>
    </Card>
  );
}

function MultiselectQuestion(props: QuestionDisplayProps) {
  return (
    <FormGroup>
      {props.question.choices?.map((choice, index) => (
        <FormControlLabel
          disabled={!props.isEditable}
          key={`choice-${index}`}
          control={
            <Checkbox
              onChange={(e, checked) => {
                props.question.choices![index].checked = checked;
                props.updateQuestion(props.question, props.index);
              }}
              checked={choice.checked ?? false}
            />
          }
          label={choice.title}
        />
      ))}
    </FormGroup>
  );
}

function TextQuestion(props: QuestionDisplayProps) {
  return (
    <TextField
      placeholder="Your answer"
      rows={3}
      multiline
      disabled={!props.isEditable}
      onChange={(e) =>
        props.updateQuestion(
          {
            ...props.question,
            textAnswer: e.target.value,
          },
          props.index
        )
      }
    />
  );
}

function SelectQuestion(props: QuestionDisplayProps) {
  return (
    <FormGroup>
      <RadioGroup
        onChange={(e, v) => {
          const index = parseInt(v);
          props.question.choices![index].checked = true;
          props.updateQuestion(props.question, props.index);
        }}
      >
        {props.question.choices?.map((choice, index) => (
          <FormControlLabel
            disabled={!props.isEditable}
            key={`choice-${index}`}
            control={<Radio />}
            label={choice.title}
            value={index}
          />
        ))}
      </RadioGroup>
    </FormGroup>
  );
}
