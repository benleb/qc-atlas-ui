import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlgorithmService } from 'api-atlas/services/algorithm.service';
import { AlgorithmRelationTypeService } from 'api-atlas/services/algorithm-relation-type.service';
import { AlgorithmRelationDto } from 'api-atlas/models/algorithm-relation-dto';
import { AlgorithmDto } from 'api-atlas/models/algorithm-dto';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AlgorithmRelationTypeDto } from 'api-atlas/models';

@Component({
  selector: 'app-add-algorithm-relation-dialog',
  templateUrl: './add-algorithm-relation-dialog.component.html',
  styleUrls: ['./add-algorithm-relation-dialog.component.scss'],
})
export class AddAlgorithmRelationDialogComponent implements OnInit {
  algorithmRelationForm: FormGroup;
  stateGroups: StateGroup[] = [];
  algoRelationTypes: AlgorithmRelationTypeDto[] = [];
  linkableAlgorithms: AlgorithmDto[] = [];
  selectedAlgorithm: AlgorithmDto;
  isUpdateDialog = false;

  constructor(
    private algorithmService: AlgorithmService,
    private algoRelationTypeService: AlgorithmRelationTypeService,
    public dialogRef: MatDialogRef<AddAlgorithmRelationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.algorithmRelationForm = new FormGroup({
      description: new FormControl(this.data.description, [
        // eslint-disable-next-line @typescript-eslint/unbound-method
        Validators.required,
      ]),
      relationType: new FormControl(this.data.relationType, [
        // eslint-disable-next-line @typescript-eslint/unbound-method
        Validators.required,
      ]),
      targetAlg: new FormControl(
        { value: this.data.targetAlg, disabled: this.data.disableAlg },
        // eslint-disable-next-line @typescript-eslint/unbound-method
        [Validators.required]
      ),
    });

    // Fill PatternRelationType if dialog is used for editing
    if (this.data.relationType) {
      this.setRelationType(this.data.relationType);
      this.isUpdateDialog = true;
    }
    if (this.data.targetAlg) {
      this.selectedAlgorithm = this.data.targetAlg;
      this.setTargetAlg(this.data.targetAlg);
    }

    // Init list of available relation types
    this.algoRelationTypeService
      .getAlgorithmRelationTypes()
      .subscribe((relationTypes) => {
        this.algoRelationTypes = relationTypes._embedded
          ? relationTypes._embedded.algoRelationTypes
          : [];
        this.stateGroups.push({
          optionName: 'Existing Algorithm-Relations',
          algoRelationTypes: this.algoRelationTypes,
        });
        // Set filtered Types if update-dialog
        if (this.isUpdateDialog) {
          this.filterTypes(this.relationType.value.name);
        }
      });

    // On close
    this.dialogRef.beforeClosed().subscribe(() => {
      this.data.relationType = this.generateRelationType(
        this.relationType.value
      );
      this.data.description = this.description.value;
      this.data.targetAlg = this.selectedAlgorithm;
    });
  }

  filterTypes(type: string): void {
    this.stateGroups[
      this.stateGroups.length - 1
    ].algoRelationTypes = this.algoRelationTypes.filter(
      (filterType) =>
        filterType.name.toLowerCase().indexOf(type.toLowerCase()) === 0
    );
  }

  generateRelationType(type): AlgorithmRelationTypeDto {
    if (type && type.id) {
      return type;
    } else {
      return type && type.name
        ? this.findObjectByName(type.name)
        : this.findObjectByName(type);
    }
  }

  findObjectByName(name): AlgorithmRelationTypeDto {
    const foundType = this.algoRelationTypes.find((x) => x.name === name);
    return foundType ? foundType : { id: null, name };
  }

  get description(): AbstractControl | null {
    return this.algorithmRelationForm.get('description');
  }

  get targetAlg(): AbstractControl | null {
    return this.algorithmRelationForm.get('targetAlg');
  }

  setTargetAlg(value): void {
    this.selectedAlgorithm = value;
    this.algorithmRelationForm.get('targetAlg').setValue(value);
  }

  setRelationType(value): void {
    this.algorithmRelationForm.get('relationType').setValue(value);
  }

  get relationType(): AbstractControl | null {
    return this.algorithmRelationForm.get('relationType');
  }

  displayRelation(type: AlgorithmRelationTypeDto): string {
    return type && type.name ? type.name : '';
  }

  displayAlgorithm(algo: AlgorithmDto): string {
    return algo && algo.name ? algo.name : '';
  }

  refreshAlgorithms(): void {
    this.linkableAlgorithms = [];
    if (!this.targetAlg.value) {
      this.selectedAlgorithm = undefined;
    }
    if (this.targetAlg.value && typeof this.targetAlg.value === 'string') {
      this.algorithmService
        .getAlgorithms({ page: 0, size: 25, search: this.targetAlg.value })
        .subscribe((algorithms) => {
          if (algorithms._embedded) {
            this.filterLinkableAlgorithms(algorithms._embedded.algorithms);
            this.selectedAlgorithm = this.linkableAlgorithms.find(
              (x) => x.name === this.targetAlg.value
            );
          }
        });
    }
  }

  filterLinkableAlgorithms(algorithms: AlgorithmDto[]): void {
    for (const algorithm of algorithms) {
      if (
        algorithm.id !== this.data.algoId &&
        !this.isAlreadyLinked(algorithm)
      ) {
        this.linkableAlgorithms.push(algorithm);
      }
    }
  }

  isAlreadyLinked(algorithm: AlgorithmDto): boolean {
    for (const relation of this.data.existingRelations) {
      if (
        relation.sourceAlgorithmId === algorithm.id ||
        relation.targetAlgorithmId === algorithm.id
      ) {
        return true;
      }
    }
    return false;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  isRequiredDataMissing(): boolean {
    return (
      this.description.errors?.required ||
      this.relationType.errors?.required ||
      !this.selectedAlgorithm
    );
  }

  onRelationInputChanged(): void {
    const searchType = this.relationType.value.name
      ? this.relationType.value
      : { name: this.relationType.value };
    // Filter existing types
    this.filterTypes(searchType.name);
    // Return Type from Input if it exists
    const existingRelationType = this.algoRelationTypes.find(
      (x) => x.name === searchType.name
    );

    // If Input-Field not empty and input type does not exist
    if (!existingRelationType && searchType.name) {
      // If pattern type does not exist and first element is existing type
      if (this.algoTypesNotEmpty() || this.isFirstTypeNew()) {
        this.pushNewRelationType(searchType);
      } else if (!this.isFirstTypeNew()) {
        this.stateGroups[0].algoRelationTypes[0] = searchType;
      }
    } else {
      if (!this.isFirstTypeNew()) {
        this.stateGroups.shift();
      }
    }
  }

  pushNewRelationType(type): void {
    this.stateGroups.unshift({
      optionName: 'New Algorithm-Relation',
      algoRelationTypes: [type],
    });
  }

  algoTypesNotEmpty(): boolean {
    return !this.stateGroups[0];
  }

  isFirstTypeNew(): boolean {
    return this.stateGroups[0].optionName !== 'New Algorithm-Relation';
  }
}

export interface DialogData {
  title: string;
  algoId: string;
  algoRelationId: string;
  relationType: AlgorithmRelationTypeDto;
  targetAlg: AlgorithmDto;
  description: string;
  existingRelations: AlgorithmRelationDto[];
  relationId: string;
  disableAlg: boolean;
}

export interface StateGroup {
  optionName: string;
  algoRelationTypes: AlgorithmRelationTypeDto[];
}
