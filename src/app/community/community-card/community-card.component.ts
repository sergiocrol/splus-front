import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Community } from '../community.model';

@Component({
  selector: 'app-community-card',
  templateUrl: './community-card.component.html',
  styleUrls: ['./community-card.component.scss'],
})
export class CommunityCardComponent implements OnInit {
  @Input() community: Community | undefined;

  constructor(private router: Router) {}

  clickCard() {
    this.community?.blogCount === 0
      ? this.router.navigate([
          `/community/${this.community?.id}`,
          {
            discussionsCount: this.community?.discussionCount,
            communityTitle: this.community?.name,
          },
        ])
      : this.router.navigate([
          `/community/${this.community?.id}`,
          {
            blogCount: this.community?.blogCount,
            communityTitle: this.community?.name,
          },
        ]);
  }

  ngOnInit(): void {}
}
