import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AboutSeqMineComponent } from './components/about-seq-mine/about-seq-mine.component';
import { AboutMembersComponent } from './components/about-members/about-members.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserTableComponent } from './components/user-table/user-table.component';
import { FileStorageTableComponent } from './components/file-storage-table/file-storage-table.component';
import { PasswordConfirmValidationDirective } from './directives/password-confirm-validation.directive';
import { FastaFileValidationDirective } from './directives/fasta-file-validation.directive';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FileStorageManageComponent } from './file-storage-manage/file-storage-manage.component';
import { UserManageComponent } from './user-manage/user-manage.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutSeqMineComponent,
    AboutMembersComponent,
    LoginComponent,
    RegisterComponent,
    UserTableComponent,
    FileStorageTableComponent,
    PasswordConfirmValidationDirective,
    FastaFileValidationDirective,
    PageNotFoundComponent,
    FileStorageManageComponent,
    UserManageComponent,
    FooterComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
