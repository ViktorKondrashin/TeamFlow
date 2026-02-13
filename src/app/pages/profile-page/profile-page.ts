import { Component, inject, signal } from '@angular/core';
import { ProfileHeader } from '../../common-ui/profile-header/profile-header';
import { ProfileService } from '../../data/services/profile.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe, NgForOf, NgOptimizedImage } from '@angular/common';
import { SvgIcon } from '../../common-ui/svg-icon/svg-icon';
import { SubscriberCard } from '../../common-ui/sidebar/subscriber-card/subscriber-card';
import { Profile } from '../../data/interfaces/profile.interface';
import { ImgUrlPipe } from '../../helpers/pipes/img-url.pipe';
import { PostFeed } from './post-feed/post-feed';

@Component({
  selector: 'app-profile-page',
  imports: [
    ProfileHeader,
    AsyncPipe,
    RouterLink,
    SvgIcon,
    ImgUrlPipe,
    PostFeed,
  ],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.scss',
})
export class ProfilePage {
  profileService = inject(ProfileService);
  route = inject(ActivatedRoute);

  me$ = toObservable(this.profileService.me);
  isMe = signal<boolean>(false);

  subscribers$ = this.profileService.getSubscribersShortList(5);

  profile$ = this.route.params.pipe(
    switchMap(({ id }) => {
      if (id === 'me'){
        this.isMe.set(true);
        return this.me$;

      } else{
        this.isMe.set(false);
        return this.profileService.getAccount(id);

      }

    }),
  );
}
