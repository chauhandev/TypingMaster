import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TypingTestComponent } from './components/typing-test/typing-test.component';
import { ModalComponent } from './components/modal/modal.component';
import { MatDialog, MatDialogModule} from '@angular/material/dialog';
@NgModule({
  declarations: [
    AppComponent,
    TypingTestComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatDialogModule
  ],
  providers: [MatDialog],
  bootstrap: [AppComponent]
})
export class AppModule { }
