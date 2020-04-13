import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TagService } from '../../../services/tag.service';
import { Tag } from '../../../model/tag.model';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {

  activeIndex = 3;
  tabs = ['algorithms', 'providers', 'sdks', 'tags'];

  tags: Array<Tag> = [];

  displayedTagsColumns: string[] = ['key', 'value'];

  constructor(private router: Router, private tagService: TagService) {
  }

  ngOnInit(): void {
    this.getAllTags();
  }

  tabIndexChanged(index: any): void {
    this.activeIndex = index;
    this.router.navigate(['overview/' + this.tabs[this.activeIndex]]);
  }

  getAllTags(): void {
    this.tagService.getAllTags().subscribe(
      data => {
        console.log(data);
        this.tags = data.tagsDtos;
      }
    );
  }

}
