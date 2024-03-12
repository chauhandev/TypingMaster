import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-typing-test',
  templateUrl: './typing-test.component.html',
  styleUrls: ['./typing-test.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TypingTestComponent {
  testOptions:any ={ testTime :Number , }
  currentWordIndex = 0;
  typedWords : (string | undefined)[] =[]; 

  textToType: string = "As a lad Jack had a jarring laugh a jagged edge to his jokes. Half the kids at school adored him half found him aloof like an old hag. Jack though had a knack for finding hidden gems a gift that had shaped his jagged path. His jalopy a faded black hulk lumbered through the hills a relic from another age. As dusk fell Jack halted gazing at the sky. A flak jacket hung loosely around him a shield against the cold. He laughed a harsh guttural sound echoing through the night haunting like a banshee's wail."

  timer: any = "";
  testTime : number = 1 ;
  timerInterval: any = null;

  constructor(private dialogRef: MatDialog) {
  }

  ngOnInit() {
     let textToType  = this.textToType.split(" ");

     const textToTypeElement = document.getElementById("textToType");
     for (let i = 0; i < textToType.length; i++){
        let text = document.createElement("span");
        text.style.margin = "2px";
        text.style.fontSize = "1.5rem";
        text.style.fontFamily = "roboto";
        text.style.padding = "4px";
        text.innerHTML = textToType[i].trim();
        text.setAttribute('wordnr', `${i}`);
        textToTypeElement?.append(text);
      }

      this.timer =  "00:05" //this.convertMinutesToFormat(this.testTime); 

  }
  convertMinutesToFormat(minutes :number) :string {
    var formattedTime;    
    if (minutes === 1) {
      formattedTime = '1:00';
    } else {
      formattedTime = minutes + ':00';
    }  
    return formattedTime;
  }

  compare(event: any) {
    this.startTimer();
    const userInput = (
      document.getElementById('userInput') as HTMLInputElement
    )?.value.trim();
    const typedWord = userInput?.split(' ').pop();
    if (typedWord && typedWord == '') {
      return;
    }
   
    const textToTypeElement = document.getElementById('textToType');
    const childElements = textToTypeElement?.children;
    if (event.keyCode === 32 || event.keyCode === 13) {
      // Space key
      this.typedWords.push(typedWord);
      if (childElements) {
        const elementWithCustomAttribute = document.querySelector(
          `[wordnr="${this.currentWordIndex}"]`
        );

        // Check if the element exists
        if (elementWithCustomAttribute) {
          const currentWordText = elementWithCustomAttribute.innerHTML.trim();
          if (typedWord === currentWordText) {
            elementWithCustomAttribute.className = '';
            elementWithCustomAttribute.classList.add('correct');
          } else {
            elementWithCustomAttribute.className = '';
            elementWithCustomAttribute.classList.add('incorrect');
          }
        } else {
          console.log("Element with wordnr='0' not found.");
        }
        const nextElementIndex = this.currentWordIndex + 1;
        const nextElement = childElements[nextElementIndex];
        if (nextElement) {
          nextElement.className = '';
          nextElement.classList.add('highlight');
          this.currentWordIndex++;
        }
        (document.getElementById('userInput') as HTMLInputElement).value = '';
      }
    } else {
      if (typedWord !== undefined && childElements) {
        if (
          !this.textToType.split(' ')[this.currentWordIndex].includes(typedWord)
        ) {
          childElements[this.currentWordIndex].className = '';
          childElements[this.currentWordIndex].classList.add('highlight-wrong');
        } else {
          childElements[this.currentWordIndex].className = '';
          childElements[this.currentWordIndex].classList.add('highlight');
        }
      }
    }
}

  resetTest() {
     this.currentWordIndex =0;
     this.typedWords = [];

     // reset css of all the span tags 
     const textToTypeElement = document.getElementById('textToType');
     const childElements = textToTypeElement?.children;
     if(childElements) {
      for (let i = 0; i < childElements.length; i++) {
        childElements[i].className = '';
       }
     }
     //reset time to inital state
     this.timer = this.convertMinutesToFormat(this.testTime);

     // clear time to start once user will start typing
     clearInterval(this.timerInterval);
     this.timerInterval = null;  
     
  }
  
  startTest() {
    const textToTypeElement = document.getElementById('textToType');
    const childElements = textToTypeElement?.children;
    if(childElements) {
     for (let i = 0; i < childElements.length; i++) {
       childElements[i].className = '';
      }
    }
  }

  startTimer() {
    if (!this.timerInterval) {
      this.timerInterval = setInterval(() => {
        let timerVal: string = this.timer;
        let newTimerVal = this.decreaseTimeByOneSecond(timerVal);
        this.timer = newTimerVal;
        if (this.timer === '00:00') {
          //open dialog to show result
          const dialogConfig = new MatDialogConfig();
          dialogConfig.panelClass = 'my-dialog-class';
          dialogConfig.width = '400px';
          dialogConfig.data = {
            speed: this.calculateSpeed(),
            totalWordsTyped: this.typedWords.length,
            correctWordsTyped: this.getCorrectWordsCount(),
          };
          this.dialogRef.open(ModalComponent, dialogConfig);

          this.resetTest();
        }
      }, 1000);
    }
  }
  calculateSpeed() {
    let speed = 0;
    let totalCharactersTyped = 0;
    for (let i = 0; i <this.typedWords.length;i++) {
        totalCharactersTyped += this.typedWords[i]?.length??0;
    }
    let charsPerWord = 4.5
    speed = (totalCharactersTyped/charsPerWord)/this.testTime;
    return Math.floor(speed);
  }
  getCorrectWordsCount() {
    let count = 0;
    for (let i = 0; i < this.typedWords.length; i++) {
      if(this.typedWords[i] === this.textToType.split(' ')[i]) 
        count++;
    }
    return count;
  }

  decreaseTimeByOneSecond(timeString :string) : string {
    // Split the time string into minutes and seconds
    var timeParts = timeString.split(':');
    var minutes = parseInt(timeParts[0]);
    var seconds = parseInt(timeParts[1]);
  
    // Convert time to total seconds
    var totalSeconds = minutes * 60 + seconds;
  
    // Decrease time by 1 second
    totalSeconds--;
  
    // Convert total seconds back to minutes and seconds
    var newMinutes = Math.floor(totalSeconds / 60);
    var newSeconds = totalSeconds % 60;
  
    // Format the new time
    var formattedMinutes = newMinutes < 10 ? '0' + newMinutes : newMinutes;
    var formattedSeconds = newSeconds < 10 ? '0' + newSeconds : newSeconds;
    var newTimeString = formattedMinutes + ':' + formattedSeconds;
  
    return newTimeString;
  }
}


