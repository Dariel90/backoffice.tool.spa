import { AuthService } from './../_services/auth.service';
import { Directive, ViewContainerRef, Input, TemplateRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole: string[];
  isVisible = false;

  constructor(private viewContainerRef: ViewContainerRef,
              private templateRef: TemplateRef<any>,
              private authService: AuthService) { }

 ngOnInit() {
   const userRoles = this.authService.decodedToken.role as Array<string>;
   if (!userRoles) {
     this.viewContainerRef.clear();
   }
   if (this.authService.roleMatch(this.appHasRole)) {
     this.isVisible = true;
     this.viewContainerRef.createEmbeddedView(this.templateRef);
   } else {
     this.isVisible = false;
     this.viewContainerRef.clear();
   }
 }

}
