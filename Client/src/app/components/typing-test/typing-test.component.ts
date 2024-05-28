import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { WebsocketService } from 'src/app/services/websocket.service';
import { ProgressDialogComponent } from '../progress-dialog/progress-dialog.component';
import { ChallengeNotificationComponent } from '../challenge-notification/challenge-notification.component';

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
  text =  { 
    middleKeys : "all ask fall sad glass flask glad add dad sag lad lad lash ash has had salad sad lass alas flash flask jags jazz slag slag gas has half glad sag hags has ash glad flag all lads sad fad flask hall all jag had glass flask jags had all sad lads had slag lads sad all has glass flag glad lad had slag lass sad glass fad glass lad jags flask all",
    upperKeys : "pot top tip pit pop out you put too pip toy yup yip tout typist quiet poetry pi piety quit yeti pew yet pie puppy poet pity up poetry put tie yeti pie pot pip pity putty pit pop out pot pip pity putty pip top tip pot out pie put pip pit pop poetry pity tip pot top pop tip pip pit pot tip put pot pit out pop you top pip pie pew out pit pip put pie tip pop pew top pit pop pot pit tip put pot putty pip pie pit pit pop out pip top pie pit pot pit pop put putty pip pie pit pit pop out pip top pie pit pot pit pop put putty pip pie pit pit pop out pip top pie pit pot pit pop put putty pip pie pit pit pop out pip top pie pit pot pit pop putty pip pie pit pit pop out pip top",
    lowerKeys : "mix men zoom zinc move zone mob maze vim coin mice box moan oven zen ice bean bone voice mom noon moon mien coon bin moxie mezzo memo boom cozen cob bozo monoxide"
  }
  textToType: string = "As a lad Jack had a jarring laugh a jagged edge to his jokes. Half the kids at school adored him half found him aloof like an old hag. Jack though had a knack for finding hidden gems a gift that had shaped his jagged path. His jalopy a faded black hulk lumbered through the hills a relic from another age. As dusk fell Jack halted gazing at the sky. A flak jacket hung loosely around him a shield against the cold. He laughed a harsh guttural sound echoing through the night haunting like a banshee's wail.".toLowerCase()

  timer: any = "";
  testTime : number = 1 ;
  timerInterval: any = null;
  opponent : any = null;
  userResult!: { speed: number; totalWordsTyped: number; correctWordsTyped: number; };
  opponentResult!: { speed: number; totalWordsTyped: number; correctWordsTyped: number; };
  isMatchInProgress = false;

  challengeConfig! :{
    textToType: string,
    time:number
  }

  constructor(private dialog: MatDialog ,private webSocketService  :WebsocketService) {
    this.webSocketService.listenForChallenge().subscribe((response) => {
      if(!this.isMatchInProgress) {
        this.openChallengeDialog(response);
        this.opponent = response.Opponent;
        this.challengeConfig = response.challengeConfig
      }
    });

    this.webSocketService.listenForChallengeResult().subscribe((response) => {
      if(!this.isMatchInProgress) {
        this.openResultDialog(response.result,true);
        this.opponent = null;
      }
      else{
        this.opponentResult = response.result;
      }
       
    });
    this.webSocketService.listenForChallengeResponse().subscribe(response => {
      if(response.response == true){ 
        this.opponent = response.opponent;
        this.challengeConfig = response.challengeConfig;      
        setTimeout(() => {
          this.startChallenge(this.challengeConfig);
          this.startTimer();
        }, 5000);
      }
      else if (response.response ===false){
        let timer = 3;
        let countDownDialogRef = this.dialog.open(ProgressDialogComponent, {
          width: '300px',
          data: { message: `${this.opponent.fullName} rejected the challenge.`, countdown: false ,timer : timer }
        });
        setTimeout(() => {
          countDownDialogRef.close();
          this.resetTest();
          this.startTimer();
        }, timer*1000);
       }
      
      
    });

    this.webSocketService.listenForOpponentCurrentlyTypingWord().subscribe((response) => {
      console.log(response);
      const textToTypeElement = document.getElementById('textToType');
      if(textToTypeElement){
        const elementWithCustomAttribute = document.querySelector(`[wordnr="${response.currentIndex}"]` );
        if(elementWithCustomAttribute){
          elementWithCustomAttribute.className = '';
          elementWithCustomAttribute.classList.add('opponentPosition');
        }
      }
    });
  }
  

  ngOnInit() {
     let textToType  = this.textToType.split(" ");
     this.addWordsToType(textToType);     
     this.timer =  this.convertMinutesToFormat(this.testTime); 
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
        if(this.opponent)
         this.webSocketService.emitToServer("currentlyTypingWord", {socketID: this.opponent.socketID, currentIndex : this.currentWordIndex});
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
     const textAreaElement = document.getElementById('userInput') as HTMLInputElement;
     if (textAreaElement) {
      textAreaElement.value = '';
      textAreaElement.focus();
     }
     this.clearWordToType();
     const shuffledWordsArray = this.shuffleArray(this.textToType.split(' '));
     this.addWordsToType(shuffledWordsArray);
   
     //reset time to inital state
     this.timer = this.convertMinutesToFormat(this.testTime);

     // clear time to start once user will start typing
     clearInterval(this.timerInterval);
     this.timerInterval = null;  
     
  }

  startChallenge(challengeConfiguration : any) {
    this.currentWordIndex =0;
    this.typedWords = [];
    const textAreaElement = document.getElementById('userInput') as HTMLInputElement;
    if (textAreaElement) {
     textAreaElement.value = '';
     textAreaElement.focus();
    }
    this.clearWordToType();
    this.addWordsToType(challengeConfiguration.textToType.split(' '));
  
    //reset time to inital state
    this.timer = this.convertMinutesToFormat(challengeConfiguration.time);

    // clear time to start once user will start typing
    clearInterval(this.timerInterval);
    this.timerInterval = null;  
    
 }
  
  startTest() {
     const textAreaElement = document.getElementById('userInput') as HTMLInputElement;
     if (textAreaElement) {
      textAreaElement.value = '';
      textAreaElement.focus();
     }
     this.clearWordToType()
     this.addWordsToType(this.textToType.split(' '));   
  }

  startTimer() {
    if (!this.timerInterval) {
      this.isMatchInProgress = true;
      this.timerInterval = setInterval(() => {
        let timerVal: string = this.timer;
        let newTimerVal = this.decreaseTimeByOneSecond(timerVal);
        this.timer = newTimerVal;
        if (this.timer === '00:00') {
          //open dialog to show result
          this.isMatchInProgress = false;

          this.userResult = {
              speed: this.calculateSpeed(),
              totalWordsTyped: this.typedWords.length,
              correctWordsTyped: this.getCorrectWordsCount(),
            }
            if(this.opponent == null)
              this.openResultDialog(null ,true);
            else
            {
              let data  = { opponent : this.opponent.socketID, result : this.userResult}
              console.log("emitting resutl to server")
              this.webSocketService.emitToServer("challengeResult",data);
              this.opponent = null;

              // open dialog later if any delay in match 
              if(this.opponentResult != null){
                this.openResultDialog(this.opponentResult,true);
                this.opponent = null;
              }
            }
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

  openChallengeDialog(data: any) {
    const dialogRef = this.dialog.open(ChallengeNotificationComponent, {
      width: '300px',
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.accepted) {
        this.webSocketService.emitToServer("challengeResponse", {challenger : data.opponent.socketID ,response : true , challengeConfig :this.challengeConfig} );
        this.showCountdownDialog();
      } else {
        this.webSocketService.emitToServer("challengeResponse", {challenger : data.opponent.socketID ,response : false} );
      }
    });
  }

  private showCountdownDialog(): void {
    let timer = 5;
    let countDownDialogRef = this.dialog.open(ProgressDialogComponent, {
      width: '300px',
      data: { message: 'Match starts in', countdown: true ,timer : timer }
    });
    setTimeout(() => {
      countDownDialogRef.close();
      this.startChallenge(this.challengeConfig);
      this.startTimer();
    }, timer*1000);
  }

  openResultDialog(opponentScore: any, showResultDialog: boolean) {
    if(showResultDialog){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.panelClass = 'my-dialog-class';
      dialogConfig.width = '400px';
      dialogConfig.disableClose = true; // Prevent closing on backdrop click
      dialogConfig.data = {
        userResult : this.userResult,
        opponentResult : opponentScore
       };
      this.dialog.open(ModalComponent, dialogConfig);
    }
    
  }

  addWordsToType(textToType: string[]) {
    const textToTypeElement = document.getElementById("textToType");
     for (let i = 0; i < textToType.length; i++){
        let text = document.createElement("span");
        text.style.margin = "2px";
        text.style.fontSize = "1.5rem";
        text.style.fontFamily = "roboto";
        text.style.padding = "2px";
        text.style.display = "inline-block";
        text.style.wordBreak = "break-all";
        text.innerHTML = textToType[i].trim();
        text.setAttribute('wordnr', `${i}`);
        if(i== 0){
          text.classList.add('highlight');
        }
        textToTypeElement?.append(text);
      }
  }

  clearWordToType() {
    const textToTypeElement = document.getElementById("textToType");
    if (textToTypeElement) {
      textToTypeElement.innerHTML = '';  
    }
    
  }

   shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; 
    }
    return array;
  }
}


