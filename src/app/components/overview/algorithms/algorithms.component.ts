import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlgorithmService } from '../../../services/algorithm.service';
import { Algorithm } from '../../../model/algorithm.model';
import { ImplementationService } from '../../../services/implementation.service';
import { Implementation } from '../../../model/implementation.model';
import { MatDialog } from '@angular/material/dialog';
import { ImportDialogComponent } from '../../importer/import-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../../environments/environment';
import { AddParameterDialogComponent } from './dialogs/add-parameter-dialog.component';
import { Parameter } from '../../../model/parameter.model';
import { AddAlgorithmDialogComponent } from './dialogs/add-algorithm-dialog.component';
import { TagService } from '../../../services/tag.service';
import { Tag } from '../../../model/tag.model';
import { Content } from '../../../model/content.model';

@Component({
  selector: 'app-algorithms',
  templateUrl: './algorithms.component.html',
  styleUrls: ['./algorithms.component.scss']
})
export class AlgorithmsComponent implements OnInit {

  activeIndex = 0;
  tabs = ['algorithms', 'providers', 'sdks', 'tags'];

  algorithms: Array<Algorithm> = [];
  tags: Array<Tag> = [];
  implementations: Array<Implementation> = [];
  implementationOpened = false;

  selectedColor = 'primary';

  selectedAlgorithm: Algorithm;
  selectedImplementation: Implementation;

  displayedParametersColumns: string[] = ['name', 'type', 'description', 'restriction'];
  displayedTagsColumns: string[] = ['key', 'value'];
  displayedImplementationColumns: string[] = ['name', 'sdk'];


  constructor(private router: Router, private algorithmService: AlgorithmService,
              private implementationService: ImplementationService, public dialog: MatDialog,
              private snackBar: MatSnackBar, private tagService: TagService) {
  }

  ngOnInit(): void {
    this.getAllAlgorithms();
    this.getTags();
  }

  getAllAlgorithms(): void {
    this.algorithmService.getAllAlgorithms().subscribe(
      data => {
        this.algorithms = data.algorithmDtos;
        // set initial selected algorithm
        if (this.algorithms.length > 0) {
          this.algorithmSelected(this.algorithms[0]);
        }
      }
    );
  }

  getAlgorithmById(id: number): void {
    this.algorithmService.getAlgorithmById(id).subscribe(
      data => {
        this.selectedAlgorithm = data;
      }
    );
  }

  getImplementationById(algoId: number, implId: number): void {
    this.implementationService.getImplementationById(algoId, implId).subscribe(
      data => {
        this.selectedImplementation = data;
      }
    );
  }

  addImplParameter(type: string): void {
    const dialogRef = this.dialog.open(AddParameterDialogComponent, {
      width: '400px',
      data: {title: 'Add new ' + type + ' parameter'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const parameter: Parameter = {
          name: result.name,
          description: result.description,
          type: result.type,
          restriction: result.restriction
        };
        this.implementationService.addParameter(parameter, this.selectedAlgorithm.id, this.selectedImplementation.id, type)
          .subscribe(
            () => {
              this.getImplementationById(this.selectedAlgorithm.id, this.selectedImplementation.id);
              this.snackBar.open('Successfully added input parameter', 'Ok', {
                duration: 2000,
              });
            }
          );
      }
    });
  }


  addAlgoParameter(type: string): void {
    const dialogRef = this.dialog.open(AddParameterDialogComponent, {
      width: '400px',
      data: {title: 'Add new ' + type + ' parameter'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const parameter: Parameter = {
          name: result.name,
          description: result.description,
          type: result.type,
          restriction: result.restriction
        };
        this.algorithmService.addParameter(parameter, this.selectedAlgorithm.id, type).subscribe(
          () => {
            this.getAlgorithmById(this.selectedAlgorithm.id);
            this.snackBar.open('Successfully added input parameter', 'Ok', {
              duration: 2000,
            });
          });
      }
    });
  }

  tabIndexChanged(index: any): void {
    this.activeIndex = index;
    this.router.navigate([environment.OVERVIEW_PAGE + this.tabs[this.activeIndex]]);
  }

  algorithmSelected(algorithm: Algorithm): void {
    this.implementationOpened = false;
    this.selectedAlgorithm = algorithm;
    this.getImplementations();
  }

  getImplementations(): void {
    this.implementationService.getImplementationsForId(this.selectedAlgorithm.id).subscribe(
      data => {
        this.implementations = data.implementationDtos;
      }
    );
  }

  openImplementation(implementation: Implementation): void {
    this.implementationOpened = true;
    this.selectedImplementation = implementation;
  }

  getAlgoColor(id: number): string {
    if (id === this.selectedAlgorithm.id) {
      return this.selectedColor;
    }
    return null;
  }

  getImplColor(id: number): string {
    if (!this.selectedImplementation) {
      return null;
    }
    if (id === this.selectedImplementation.id) {
      return this.selectedColor;
    }
    return null;
  }

  importJSON(): void {
    const dialogRef = this.dialog.open(ImportDialogComponent, {
      width: '250px',
      data: {title: 'Import new algorithm'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.algorithmService.createAlgorithm(result).subscribe(
          data => {
            this.algorithms.push(data);
            this.algorithmSelected(data);
            this.snackBar.open('Successfully added new algorithm', 'Ok', {
              duration: 2000,
            });
          }
        );
      }
    });
  }

  deleteAlgorithm(): void {
    this.algorithmService.deleteAlgorithm(this.selectedAlgorithm.id).subscribe(
      () => {
        this.getAllAlgorithms();
        this.snackBar.open('Successfully deleted algorithm.', 'Ok', {
          duration: 2000,
        });
      }
    );
  }

  importImplJSON(): void {
    const dialogRef = this.dialog.open(ImportDialogComponent, {
      width: '250px',
      data: {title: 'Import new implementation'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.implementationService.createImplementation(this.selectedAlgorithm.id, result).subscribe(
          data => {
            this.implementations.push(data);
            this.snackBar.open('Successfully added new implementation', 'Ok', {
              duration: 2000,
            });
          }
        );
      }
    });
  }

  getTags(): void {
    this.tagService.getAllTags().subscribe(
      data => {
        this.tags = data.tagsDtos;
      }
    );
  }

  addAlgo(): void {
    const dialogRef = this.dialog.open(AddAlgorithmDialogComponent, {
      width: '600px',
      data: {title: 'Add new algorithm', tags: this.tags}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const resultContent: Content = {
          description: result.content
        };
        const algorithm: Algorithm = {
          name: result.name,
          inputParameters: result.inputParameters,
          content: resultContent,
          outputParameters: result.outputParameters,
          tags: [result.tag]
        };
        this.algorithmService.addAlgorithm(algorithm).subscribe(
          data => {
            this.algorithms.push(data);
            this.snackBar.open('Successfully added new algorithm', 'Ok', {
              duration: 2000,
            });
          }
        );
      }
    });
  }

  addImpl(): void {
  }
}
