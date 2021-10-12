import { RichText } from "prismic-dom";


export function TextToReadingDuration(content){

    let fullText = '';
    const readWordsPerMinute = 200;

    content.forEach(postContent => {
      fullText += postContent.heading;
      fullText += RichText.asText(postContent.body);
    });


    return Math.ceil(fullText.split(/\s/g).length / readWordsPerMinute);
}