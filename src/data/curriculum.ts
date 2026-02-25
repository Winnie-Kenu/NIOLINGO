import goodMorningImg from "@/assets/good-morning.png";
import goodNightImg from "@/assets/good-night.png";
import howYouDeyImg from "@/assets/how-you-dey.png";
import howTingsImg from "@/assets/how-tings.png";
import throwSaluteImg from "@/assets/throway-salute.png";
import iDeyHailImg from "@/assets/i-dey-hail.png";
import twaleImg from "@/assets/twale.png";
import goodMorningPapaImg from "@/assets/good-morning-papa.png";
import goodMorningMamaImg from "@/assets/good-morning-mama.png";
import howFarImg from "@/assets/how-far.png";
import unaWellDoneImg from "@/assets/una-well-done.png";
import byeByeImg from "@/assets/bye-bye-o.png";
import weGoSeeImg from "@/assets/we-go-see-tomorrow.png";

export interface Presentation {
  word: string;
  picture: string;
  grammar: string;
  cultural_note: string;
}

export interface Dialogue {
  speaker1: string;
  speaker2: string;
  picture_context: string[];
}

export interface Exercise {
  type: "multiple_choice";
  question_picture: string;
  question_word: string;
  options: string[];
  answer: string;
}

export interface AssessmentPair {
  word: string;
  picture: string;
}

export interface Assessment {
  type: "match_pairs";
  pairs: AssessmentPair[];
}

export interface FillInGap {
  sentence: string;
  answer: string;
  options: string[];
  picture: string;
}

export interface TypingExercise {
  sentence: string;
  answer: string;
  picture: string;
}

export interface Lesson {
  lesson_title: string;
  presentations: Presentation[];
  dialogues: Dialogue[];
  exercises: Exercise[];
  fillInGap: FillInGap[];
  typingExercises: TypingExercise[];
  assessment: Assessment[];
}

export interface Unit {
  unit: string;
  lessons: Lesson[];
}

export const curriculum: Unit = {
  unit: "Greetings",
  lessons: [
    {
      lesson_title: "How people wey sabi dey greet!",
      presentations: [
        {
          word: "Good morning",
          picture: goodMorningImg,
          grammar: "How you go greet for morning",
          cultural_note: "You go take greet people when the day still dey early",
        },
        {
          word: "Good night",
          picture: goodNightImg,
          grammar: "How you go take greet people for night",
          cultural_note: "Use am greet people before you sleep",
        },
        {
          word: "How you dey?",
          picture: howYouDeyImg,
          grammar: "You go take am ask how pesin body dey feel",
          cultural_note: "How you go take ask how your friends dey do",
        },
        {
          word: "How tings?",
          picture: howTingsImg,
          grammar: "Take am check how tings dey go",
          cultural_note: "You fit take am ask how friends and other people dey do",
        },
      ],
      dialogues: [
        {
          speaker1: "Good morning",
          speaker2: "Morning",
          picture_context: [goodMorningImg, goodMorningImg],
        },
        {
          speaker1: "Good night",
          speaker2: "Sleep well o",
          picture_context: [goodNightImg, goodNightImg],
        },
        {
          speaker1: "How you dey?",
          speaker2: "I dey fine, you nko?",
          picture_context: [howYouDeyImg, howYouDeyImg],
        },
        {
          speaker1: "How tings?",
          speaker2: "Tings dey okay 😊",
          picture_context: [howTingsImg, howTingsImg],
        },
      ],
      exercises: [
        {
          type: "multiple_choice",
          question_picture: goodMorningImg,
          question_word: "Good morning",
          options: ["Good morning", "Good night", "How you dey?", "How tings?"],
          answer: "Good morning",
        },
        {
          type: "multiple_choice",
          question_picture: goodNightImg,
          question_word: "Good night",
          options: ["How tings?", "Good morning", "Good night", "How you dey?"],
          answer: "Good night",
        },
      ],
      fillInGap: [
        {
          sentence: "Good ___",
          answer: "morning",
          options: ["morning", "night", "dey", "tings"],
          picture: goodMorningImg,
        },
        {
          sentence: "How you ___?",
          answer: "dey",
          options: ["dey", "hail", "far", "sup"],
          picture: howYouDeyImg,
        },
      ],
      typingExercises: [
        {
          sentence: "Good ___",
          answer: "morning",
          picture: goodMorningImg,
        },
        {
          sentence: "How you ___?",
          answer: "dey",
          picture: howYouDeyImg,
        },
      ],
      assessment: [
        {
          type: "match_pairs",
          pairs: [
            { word: "Good morning", picture: goodMorningImg },
            { word: "Good night", picture: goodNightImg },
            { word: "How you dey?", picture: howYouDeyImg },
            { word: "How tings?", picture: howTingsImg },
          ],
        },
      ],
    },
    {
      lesson_title: "How you go take greet Friends & Family!",
      presentations: [
        {
          word: "I throway salute",
          picture: throwSaluteImg,
          grammar: "Na for friends or family",
          cultural_note: "How you go greet to show respect",
        },
        {
          word: "I dey hail o",
          picture: iDeyHailImg,
          grammar: "How you fit greet hello to familiar people",
          cultural_note: "How you go take dey greet special people",
        },
        {
          word: "Twale",
          picture: twaleImg,
          grammar: "Greet friends and oga dem",
          cultural_note: "How you go greet for street",
        },
      ],
      dialogues: [
        {
          speaker1: "How you dey?",
          speaker2: "I dey, kampe 😊",
          picture_context: [howYouDeyImg, howYouDeyImg],
        },
        {
          speaker1: "Wetin dey sup?",
          speaker2: "No wahala 😊",
          picture_context: [throwSaluteImg, twaleImg],
        },
      ],
      exercises: [
        {
          type: "multiple_choice",
          question_picture: throwSaluteImg,
          question_word: "I throway salute",
          options: ["Twale", "I throway salute", "I dey hail o", "How far"],
          answer: "I throway salute",
        },
        {
          type: "multiple_choice",
          question_picture: twaleImg,
          question_word: "Twale",
          options: ["I dey hail o", "Good morning", "Twale", "Bye bye o"],
          answer: "Twale",
        },
      ],
      fillInGap: [
        {
          sentence: "I ___ salute",
          answer: "throway",
          options: ["hail", "throway", "dey", "give"],
          picture: throwSaluteImg,
        },
        {
          sentence: "I dey ___ o",
          answer: "hail",
          options: ["hail", "throway", "salute", "sup"],
          picture: iDeyHailImg,
        },
      ],
      typingExercises: [
        {
          sentence: "I ___ salute",
          answer: "throway",
          picture: throwSaluteImg,
        },
        {
          sentence: "Twale ___",
          answer: "oga",
          picture: twaleImg,
        },
      ],
      assessment: [
        {
          type: "match_pairs",
          pairs: [
            { word: "I throway salute", picture: throwSaluteImg },
            { word: "I dey hail o", picture: iDeyHailImg },
            { word: "Twale", picture: twaleImg },
          ],
        },
      ],
    },
    {
      lesson_title: "How you go take greet people wey don old!",
      presentations: [
        {
          word: "Good morning Papa, how body?",
          picture: goodMorningPapaImg,
          grammar: "Greet elder men with respect",
          cultural_note: "Use am show respect for age",
        },
        {
          word: "Good morning Mama, how body?",
          picture: goodMorningMamaImg,
          grammar: "Take am greet old woman with respect",
          cultural_note: "Use am show respect for age",
        },
      ],
      dialogues: [
        {
          speaker1: "How body Papa?",
          speaker2: "My body dey kampe 😊",
          picture_context: [goodMorningPapaImg, goodMorningPapaImg],
        },
        {
          speaker1: "Good morning Mama, how body?",
          speaker2: "My body not too strong, I dey manage 😞",
          picture_context: [goodMorningMamaImg, goodMorningMamaImg],
        },
      ],
      exercises: [
        {
          type: "multiple_choice",
          question_picture: goodMorningPapaImg,
          question_word: "Good morning Papa, how body?",
          options: ["Good morning Papa, how body?", "Good morning Mama, how body?", "How far?", "Good morning"],
          answer: "Good morning Papa, how body?",
        },
      ],
      fillInGap: [
        {
          sentence: "Good morning ___, how body?",
          answer: "Papa",
          options: ["Papa", "Mama", "Oga", "Friend"],
          picture: goodMorningPapaImg,
        },
        {
          sentence: "Good morning ___, how body?",
          answer: "Mama",
          options: ["Mama", "Papa", "Oga", "Friend"],
          picture: goodMorningMamaImg,
        },
      ],
      typingExercises: [
        {
          sentence: "How body ___?",
          answer: "Papa",
          picture: goodMorningPapaImg,
        },
        {
          sentence: "Good morning ___",
          answer: "Mama",
          picture: goodMorningMamaImg,
        },
      ],
      assessment: [
        {
          type: "match_pairs",
          pairs: [
            { word: "Good morning Papa, how body?", picture: goodMorningPapaImg },
            { word: "Good morning Mama, how body?", picture: goodMorningMamaImg },
          ],
        },
      ],
    },
    {
      lesson_title: "Other Ways to take Greet People!",
      presentations: [
        {
          word: "How far?",
          picture: howFarImg,
          grammar: "Simple greeting",
          cultural_note: "Take am ask how person body dey do",
        },
        {
          word: "Una well done o",
          picture: unaWellDoneImg,
          grammar: "Take am greet people wey busy",
          cultural_note: "Wen people join body because say dem busy, you go take am greet them",
        },
        {
          word: "Bye bye o",
          picture: byeByeImg,
          grammar: "When you don dey commot",
          cultural_note: "When you wan commot from your friends or family",
        },
        {
          word: "We go see tomorrow",
          picture: weGoSeeImg,
          grammar: "When you Promise to meet persin again",
          cultural_note: "When you go see person later",
        },
      ],
      dialogues: [
        {
          speaker1: "How far?",
          speaker2: "I dey kampe 😊",
          picture_context: [howFarImg, howFarImg],
        },
        {
          speaker1: "Bye bye o",
          speaker2: "We go see tomorrow",
          picture_context: [byeByeImg, weGoSeeImg],
        },
      ],
      exercises: [
        {
          type: "multiple_choice",
          question_picture: howFarImg,
          question_word: "How far?",
          options: ["How far?", "Bye bye o", "Una well done o", "We go see tomorrow"],
          answer: "How far?",
        },
        {
          type: "multiple_choice",
          question_picture: byeByeImg,
          question_word: "Bye bye o",
          options: ["We go see tomorrow", "How far?", "Bye bye o", "Una well done o"],
          answer: "Bye bye o",
        },
      ],
      fillInGap: [
        {
          sentence: "How ___?",
          answer: "far",
          options: ["far", "dey", "tings", "sup"],
          picture: howFarImg,
        },
        {
          sentence: "___ well done o",
          answer: "Una",
          options: ["Una", "We", "I", "You"],
          picture: unaWellDoneImg,
        },
      ],
      typingExercises: [
        {
          sentence: "How ___?",
          answer: "far",
          picture: howFarImg,
        },
        {
          sentence: "Bye ___ o",
          answer: "bye",
          picture: byeByeImg,
        },
      ],
      assessment: [
        {
          type: "match_pairs",
          pairs: [
            { word: "How far?", picture: howFarImg },
            { word: "Una well done o", picture: unaWellDoneImg },
            { word: "Bye bye o", picture: byeByeImg },
            { word: "We go see tomorrow", picture: weGoSeeImg },
          ],
        },
      ],
    },
  ],
};
