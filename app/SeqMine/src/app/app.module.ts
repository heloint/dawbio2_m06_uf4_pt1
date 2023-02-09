import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { FileStorageManageComponent } from './components/file-storage-manage/file-storage-manage.component';
import { UserManageComponent } from './components/user-manage/user-manage.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { ConfirmationPageComponent } from './components/confirmation-page/confirmation-page.component';

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
    HeaderComponent,
    ConfirmationPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
