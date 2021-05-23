import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Store } from '@ngrx/store';
import { first } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';

import { UIService } from 'src/app/shared/ui.service';
import { CommunityService } from '../community.service';
import * as UI from '../../shared/ui.actions';
import * as Auth from '../../auth/auth.actions';
import * as fromRoot from '../../app.reducer';
import { AuthService } from 'src/app/auth/auth.service';
import { Discussion } from './discussion.model';

import { discussionsMock } from '../../mock/discussions';
import { ExcelService } from './excel.service';

@Component({
  selector: 'app-discussions',
  templateUrl: './discussions.component.html',
  styleUrls: ['./discussions.component.scss'],
})
export class DiscussionsComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = ['title', 'author', 'displayDate', 'select'];
  dataSource!: MatTableDataSource<Discussion>;
  discussions: Discussion[] = [];
  selection = new SelectionModel<Discussion>(true, []);
  communityTitle: string = '';
  selectedDiscussions: Discussion[] = [];
  isLoading$!: Observable<boolean>;
  fetchCall$!: Observable<any>;
  fbSubs: Subscription[] = [];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private aroute: ActivatedRoute,
    private router: Router,
    private communityService: CommunityService,
    private authService: AuthService,
    private uiService: UIService,
    private store: Store<fromRoot.State>,
    private excelService: ExcelService
  ) {}

  isMedia() {
    const selectedItems = this.selection.selected.filter(dis => dis.fileIdentifier);
    return selectedItems.length === 0
  }

  async downloadMedia() {
    // const selectedFiles = this.selection.selected.map(dis => {
    //   return {
    //     uri: dis.fileIdentifier,
    //     name: dis.title
    //   }
    // });
    // https://salty-earth-46109.herokuapp.com/
    // const url = "https://samsung.sumtotal.host/Broker/Token/Saml11.ashx?wa=wsignin1.0&wtrealm=https://samsung.sumtotal.host/core/&wreply=http://samsung.sumtotal.host/Core/4d5ce68cb03442cfbb1371fb843198a9.mp3.sumtfile?type=2";
    const url = "https://salty-earth-46109.herokuapp.com/https://samsung.sumtotal.host/Core/4d5ce68cb03442cfbb1371fb843198a9.mp3.sumtfile?type=2";
    this.communityService.fetchMedia({ url }).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    )
    // const response = await fetch("https://samsung.sumtotal.host/Core/4d5ce68cb03442cfbb1371fb843198a9.mp3.sumtfile?type=2", {
    //   "headers": {
    //     "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
    //     "sec-ch-ua-mobile": "?0",
    //     "upgrade-insecure-requests": "1"
    //   },
    //   "body": null,
    //   "method": "GET",
    //   "mode": "cors",
    //   "credentials": "omit"
    // });
    // console.log(response);
    // const blob = await response.blob();
    // console.log(blob)
    // var url = window.URL.createObjectURL(blob);
    // var a = document.createElement('a');
    // a.href = url;
    // a.download = "filename.mp3";
    // document.body.appendChild(a);
    // a.click();    
    // a.remove();
  }

  createExcel() {
    const selectedJsonData = this.selection.selected.map((el) => {
      return {
        Id: el.author.id,
        Nombre: el.author.fullName,
        Título: el.title,
        Fecha: el.createdDate,
      };
    });
    this.excelService.exportAsExcelFile(selectedJsonData, this.communityTitle);
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }

  checkboxLabel(row?: Discussion): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.id + 1
    }`;
  }

  isAllSelected() {
    if (this.dataSource) {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
    return false;
  }

  checkData(row?: any) {
    if (row) {
      this.selection.toggle(row);
    } else {
      this.isAllSelected()
        ? this.selection.clear()
        : this.dataSource &&
          this.dataSource.data.forEach((row) => this.selection.select(row));
    }
  }

  applyFilter(event: Event) {
    if (this.dataSource) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }

  isHidden() {
    return window.innerWidth < 500 ? 'none' : null;
  }

  ngOnInit(): void {
    // this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    // this.aroute.params.pipe(first()).subscribe((param) => {
    //   const communityId = param.id;
    //   const discussionsCount =
    //     this.aroute.snapshot.paramMap.get('discussionsCount') || '60';
    //   this.communityTitle =
    //     this.aroute.snapshot.paramMap.get('communityTitle') || '';
    // });
    // this.discussions = discussionsMock.body.data.discussions;
    // this.dataSource = new MatTableDataSource(this.discussions);
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    // this.dataSource.sortingDataAccessor = (item: any, property) => {
    //   switch (property) {
    //     case 'author':
    //       return item.author.fullName;
    //     default:
    //       return item[property];
    //   }
    // };

    this.fbSubs.push(
      this.aroute.params.pipe(first()).subscribe((param) => {
        this.isLoading$ = this.store.select(fromRoot.getIsLoading);
        const communityId = param.id;
        const discussionsCount =
          this.aroute.snapshot.paramMap.get('discussionsCount') || '60';
        const blogCount = this.aroute.snapshot.paramMap.get('blogCount') || '0';
        this.communityTitle =
          this.aroute.snapshot.paramMap.get('communityTitle') || '';

        this.store.dispatch(new UI.StartLoading());
        this.fetchCall$ =
          blogCount === '0' && discussionsCount === '0'
            ? this.communityService.fetchActivity({ communityId })
            : blogCount === '0'
              ? this.communityService.fetchDiscussions({
                  communityId,
                  discussionsCount,
                })
              : this.communityService.fetchBlog({ communityId, blogCount });

        this.fbSubs.push(
          this.fetchCall$.subscribe(
            (res) => {
              console.log(res);
              this.store.dispatch(new UI.StopLoading());
              this.discussions = res;
              this.dataSource = new MatTableDataSource(this.discussions);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
              this.dataSource.sortingDataAccessor = (item: any, property) => {
                switch (property) {
                  case 'author':
                    return item.author.fullName;
                  default:
                    return item[property];
                }
              };
            },
            (err) => {
              this.store.dispatch(new UI.StopLoading());
              this.uiService.showSnackbar(
                'La sesión ha caducado.',
                'cerrar',
                5000,
                'error'
              );
              this.authService.logout();
            }
          )
        );
      })
    );
  }

  ngOnDestroy(): void {
    this.fbSubs.forEach((sub: Subscription) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }
}
