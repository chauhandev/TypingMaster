import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  userResult: {
    speed: number | undefined;
    totalWordsTyped: number | undefined;
    correctWordsTyped: number | undefined;
  };
  opponentResult: {
    speed: number | undefined;
    totalWordsTyped: number | undefined;
    correctWordsTyped: number | undefined;
  };
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    console.log("open result dialog constructor")
    console.log(data);
  }

}
