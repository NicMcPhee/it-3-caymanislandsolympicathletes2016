import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ViewerPageComponent } from './viewer-page/viewer-page.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: '/viewers', component: ViewerPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
