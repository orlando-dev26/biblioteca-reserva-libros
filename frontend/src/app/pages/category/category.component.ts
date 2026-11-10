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
import { Category } from '../../model/library';
import { CategoryStore } from '../../store/category.store';
import { CategoryService } from '../../services/category.service';
import { CategoryDialogComponent } from './category-dialog.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';
import { NotificationService } from '../../shared/notification.service';
@Component({
  selector: 'app-category',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
  ],
  providers: [CategoryStore],
  templateUrl: './category.component.html',
})
export class CategoryComponent {
  readonly store = inject(CategoryStore);
  private readonly service = inject(CategoryService);
  private readonly dialog = inject(MatDialog);
  private readonly notification = inject(NotificationService);
  readonly dataSource = new MatTableDataSource<Category>();
  readonly columns = ['name', 'description', 'state', 'actions'];
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
  open(item?: Category) {
    this.dialog
      .open(CategoryDialogComponent, {
        width: '600px',
        maxWidth: '95vw',
        disableClose: true,
        data: item ? { ...item } : null,
      })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => this.store.reload());
  }
  remove(item: Category) {
    this.dialog
      .open(ConfirmDialogComponent, { width: '420px', data: item.name })
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(() => this.service.delete(item.idCategory!)),
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
