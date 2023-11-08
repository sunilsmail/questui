import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MaintainService } from 'shared/services/maintenace.service';
// import { StoreNames } from 'shared/models';
import { PropertiesService } from 'shared/services/properties.service';
import { UserService } from 'shared/services/user.service';

@Component({
  selector: 'as-chat-bot',
  templateUrl: './as-chat-bot.component.html',
  styleUrls: ['./as-chat-bot.component.scss']
})
export class AsChatBotComponent implements OnInit, AfterViewInit,OnDestroy {
  // @Input() appName: string;
  chatBotCovidJsUrl: any;
  chatBotCssUrl: any;
  chatbotconfig: any;
  chatbotavailability: any;
  subscription: Subscription;
  // questDirect = StoreNames.questDirect;
  // myQuest = StoreNames.myQuest;
  destroy$ = new Subject<void>();
  constructor(private propertiesService: PropertiesService,
    private http: HttpClient,
    private maintainService: MaintainService,
    private userService: UserService,public media: MediaObserver, private route: ActivatedRoute,) {
  }

  ngOnInit() {
    // console.log('chat boat in AS');
    this.propertiesService.getChatbotAvailUrl().subscribe(availUrl => {
      // for testing purpose defaulting to qa env.
      // this.chatbotavailability = 'https://chatbottok-qa.questdiagnostics.com/checkbotavailablity';
      this.chatbotavailability = availUrl;
      this.getChatBotConfig();
    });

   this.settingBottonOfchatbotInCheckoutFlow();
  }

  private settingBottonOfchatbotInCheckoutFlow() {
    combineLatest(this.route.queryParams.pipe(takeUntil(this.destroy$)),
    this.maintainService.getMessageClose().pipe(takeUntil(this.destroy$))
  ).subscribe(([params,value]) => {
    const token = params['token'];
    const chatbot = document.getElementById('chatBtn');
      console.log('settingBottonOfchatbotInCheckoutFlow',chatbot);
      if (value) {
        if (chatbot) {
          chatbot.style.bottom = '35px';
          document.getElementById('chat_tooltip_text').style.display = 'block';     }
      } else {
        if (chatbot && !this.maintainService.isMessageNotAvilable) {
          this.media.media$.subscribe((change: MediaChange) => {
            if (change.mqAlias === 'xs'){
              token ? chatbot.style.bottom = '40px' : chatbot.style.bottom = '160px';
              document.getElementById('chat_tooltip_text').style.display = 'none';
            } else {
              chatbot.style.bottom = '130px';
              document.getElementById('chat_tooltip_text').style.display = 'block';
            }
            console.log(change.mqAlias);
          });
        }
      }
  });
  }

  public loadScript() {
    let isFound = false;
    const scripts = document.getElementsByTagName('script');
    for (let script = 0; script < scripts.length; ++script) {
      if (scripts[script].getAttribute('src') != null && scripts[script].getAttribute('src').includes('loader')) {
        isFound = true;
      }
    }

    if (!isFound) {
      combineLatest(
          this.propertiesService.getChatbotJsUrl(),
          this.propertiesService.getChatbotCssUrl()
        ).subscribe(([srcUrl, cssUrl]) => {
          this.chatBotCssUrl = cssUrl;
          this.chatBotCovidJsUrl = srcUrl;
        });

      if (this.chatBotCovidJsUrl) {
        this.loadDynamicScripts();
      }
      if (this.chatBotCssUrl) {
        this.loadDynamicCss();
      }
    }
  }
  private loadDynamicScripts() {
     const dynamicScripts = this.chatBotCovidJsUrl.split('#');
    // const dynamicScripts = [
    //   'https://chatbottok-qa.questdiagnostics.com/cdn/js/botchat.min.js',
    //   'https://chatbottok-qa.questdiagnostics.com/cdn/js/polyfill.js',
    //   'https://chatbottok-qa.questdiagnostics.com/cdn/js/promise.min.js',
    //   'https://chatbottok-qa.questdiagnostics.com/cdn/js/promise.auto.min.js',
    //   'https://chatbottok-qa.questdiagnostics.com/cdn/js/moment.js',
    //   'https://chatbottok-qa.questdiagnostics.com/cdn/js/healthbotQuestDirect.min.js'
    // ];
    for (let dsrc = 0; dsrc < dynamicScripts.length; dsrc++) {
      const ele = document.createElement('script');
      ele.src = dynamicScripts[dsrc];
      ele.type = 'text/javascript';
      ele.async = false;
      ele.charset = 'utf-8';
      if (typeof ele !== 'undefined') {
        document.getElementsByTagName('head')[0].appendChild(ele);
      }
    }
  }

  private loadDynamicCss() {
    const dynamicStyles = this.chatBotCssUrl.split('#');
    // const dynamicStyles = [
    //   'https://chatbottok-qa.questdiagnostics.com/cdn/css/botchat.css',
    //   'https://chatbottok-qa.questdiagnostics.com/cdn/css/botstyle.css?v=5',
    //   'https://use.fontawesome.com/releases/v5.2.0/css/all.css'
    // ];
    for (let css = 0; css < dynamicStyles.length; css++) {
      const node = document.createElement('link');
      node.href = dynamicStyles[css];
      node.rel = 'stylesheet';
      if (typeof node !== 'undefined') {
        document.getElementsByTagName('head')[0].appendChild(node);
      }
    }
    setTimeout(() => {
      document.getElementById('chat_tooltip_text').style.visibility = 'visible';
      this.isAuthenticated();
    }, 1000);
  }

  private isAuthenticated() {
    this.userService.isAuthenticated$.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        if (this.maintainService.isMessageNotAvilable) {
          this.maintainService.setMessageClose(true);
        } else {
          this.maintainService.setMessageClose(false);
        }
      } else {
        this.maintainService.setMessageClose(false);
      }
    });
  }

  private getChatBotConfig() {
    this.http.get(this.chatbotavailability).subscribe(availability => {
      this.propertiesService.getChatbotConfig().subscribe(config => {
        this.chatbotconfig = config;
      //  // testing purpose manually enabling chatbot need to remove below code
      //   if (!availability) {
      //     availability = true;
      //   }
        if (this.chatbotconfig === 'true' && availability) {
          this.loadScript();
        } else {
          this.chatbotconfig = 'false';
        }
      });
    });
  }
  public onEnterPressed() {
    let element: HTMLElement = document.getElementById('chatBtn') as HTMLElement;
    element.click();
    setTimeout(() => {
      element = document.getElementById('botContainer') as HTMLElement;
      element.focus();
    });
  }

  ngAfterViewInit(): void {
    // const element: HTMLElement = document.getElementById('chatBtn') as HTMLElement;
    // setTimeout(() => {
    //   element.style.position = 'inherit !important'
    // }, 5000);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
