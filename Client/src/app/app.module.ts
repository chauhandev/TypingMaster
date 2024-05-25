import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TypingTestComponent } from './components/typing-test/typing-test.component';
import { ModalComponent } from './components/modal/modal.component';
import { MatDialog, MatDialogModule} from '@angular/material/dialog';
import { SignupComponent } from './components/signup/signup.component';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule} from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component'; 
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { ChallengeNotificationComponent } from './components/challenge-notification/challenge-notification.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProgressDialogComponent } from './components/progress-dialog/progress-dialog.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    AppComponent,
    TypingTestComponent,
    ModalComponent,
    SignupComponent,
    LoginComponent,
    DashboardComponent,
    HeaderComponent,
    SidebarComponent,
    ChallengeNotificationComponent,
    ProgressDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    HttpClientModule,
    ReactiveFormsModule,
    NoopAnimationsModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatTooltipModule 
  ],
  providers: [MatDialog],
  bootstrap: [AppComponent]
})
export class AppModule { }
