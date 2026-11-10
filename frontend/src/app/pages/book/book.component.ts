import { Component, inject, effect, viewChild } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { filter, switchMap } from 'rxjs';
import { Book } from '../../model/library';
import { BookStore } from '../../store/book.store';
import { BookService } from '../../services/book.service';
import { BookDialogComponent } from './book-dialog.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';
import { NotificationService } from '../../shared/notification.service';
@Component({
  selector: 'app-book',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
  ],
  providers: [BookStore],
  templateUrl: './book.component.html',
})
export class BookComponent {
  readonly store = inject(BookStore);
  private readonly service = inject(BookService);
  private readonly dialog = inject(MatDialog);
  private readonly notification = inject(NotificationService);
  readonly dataSource = new MatTableDataSource<Book>();
  readonly columns = ['title', 'author', 'isbn', 'categoryName', 'available', 'actions'];
  readonly paginator = viewChild(MatPaginator);
  readonly sort = viewChild(MatSort);
  constructor() {
    effect(() => {
      this.dataSource.data = this.store.items();
      this.dataSource.paginator = this.paginator() ?? null;
      this.dataSource.sort = this.sort() ?? null;
    });
  }
  filter(event: Event) {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.paginator?.firstPage();
  }
  open(item?: Book) {
    this.dialog
      .open(BookDialogComponent, {
        width: '600px',
        maxWidth: '95vw',
        disableClose: true,
        data: item ? { ...item } : null,
      })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => this.store.reload());
  }
  remove(item: Book) {
    this.dialog
      .open(ConfirmDialogComponent, { width: '420px', data: item.title })
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(() => this.service.delete(item.idBook!)),
      )
      .subscribe({
        next: () => {
          this.notification.show('Registro eliminado');
          this.store.reload();
        },
        error: () => {},
      });
  }
}
