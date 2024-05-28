import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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
  constructor(public dialogRef: MatDialogRef<ModalComponent>,@Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
