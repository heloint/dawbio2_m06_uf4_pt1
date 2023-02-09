import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { AboutSeqMineComponent } from './components/about-seq-mine/about-seq-mine.component';
import { AboutMembersComponent } from './components/about-members/about-members.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserTableComponent } from './components/user-table/user-table.component';
import { FileStorageTableComponent } from './components/file-storage-table/file-storage-table.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { FileStorageManageComponent } from './components/file-storage-manage/file-storage-manage.component';
import { UserManageComponent } from './components/user-manage/user-manage.component';
import { ConfirmationPageComponent } from './components/confirmation-page/confirmation-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'about-seq-mine',
    component: AboutSeqMineComponent,
  },
  {
    path: 'about-members',
    component: AboutMembersComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'user-table',
    component: UserTableComponent,
  },
  {
    path: 'user-modify',
    component: UserManageComponent,
  },
  {
    path: 'user-add',
    component: UserManageComponent,
  },
  {
    path: 'file-storage-table',
    component: FileStorageTableComponent,
  },
  {
    path: 'file-storage-manage',
    component: FileStorageManageComponent,
  },
  {
    path: 'confirm-page',
    component: ConfirmationPageComponent,
  },
  {
    path: '**', // Cuando el usuario se equivoca con la ruta.
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
