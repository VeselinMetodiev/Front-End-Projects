import { FormFieldState, ValidationConfig, ValidationResult } from "./validate.js";
import { AppStateStore } from "./state-store.js";
import { BlogsAPI } from "./blogs-api-client.js";
import { Post } from "./posts.js";
import { FormFieldDict, IdType } from "./shared-types.js";
import { ChangedStatus, ValidationStatus } from "./state-enums.js";

// interface BlogControllerType {
//   postsSection: HTMLElement;
//   erorrsDiv: HTMLElement;
//   addPostForm: HTMLFormElement;
//   resetButton: HTMLButtonElement;
//   init(): Promise<void>;
// }

class BlogsController {
  postsSection = document.getElementById("posts")!;
  erorrsDiv = document.getElementById("errors")!;
  protected addPostForm = document.getElementById("add-post-form")! as HTMLFormElement;
  resetButton = document.getElementById("form-reset-button")! as HTMLButtonElement;

  initFormState(formElement: HTMLFormElement){
    const formData = new FormData(formElement);
    const np: FormFieldDict<FormFieldState> = {};
    formData.forEach((value, key) => {
      np[key] = new FormFieldState(ValidationStatus.INVALID, ChangedStatus.PRISTINE)
    });
  }

  private changeFormState(){
    console.log("Button up")
  }

  async init() {
    this.addPostForm.addEventListener("submit", this.handleSubmitPost);
    this.resetButton.addEventListener("click", this.resetForm);
    this.addPostForm.addEventListener("change", this.validateForm, true);
    this.addPostForm.addEventListener("keyup", this.changeFormState);

    try {
      const allPosts = await BlogsAPI.getAllPosts();
      AppStateStore.allPosts = allPosts;
      this.showPosts(allPosts);
    } catch (err) {
      this.showError(err);
    }

    this.initFormState(this.addPostForm);
  }

  showPosts(posts: Post[]) {
    posts.forEach((post) => this.addPostDOM(post));
  }

  showError(err: any) {
    this.erorrsDiv.innerHTML = `<div>${err}</div>`;
  }

  addPostDOM(post: Post) {
    const postElem = document.createElement("article");
    postElem.setAttribute("id", post.id!.toString());
    postElem.className = "col s12 m6 l4";
    this.updateArticleInnerHtml(postElem, post);
    this.postsSection.insertAdjacentElement("beforeend", postElem);
  }

  updatePostDOM(post: Post) {
    const postElem = document.getElementById(post.id!.toString())!;
    this.updateArticleInnerHtml(postElem, post);
  }

  private updateArticleInnerHtml(postElem: HTMLElement, post: Post) {
    postElem.innerHTML = `
      <div class="card">
      <div class="card-image waves-effect waves-block waves-light">
        <img class="activator" src="${post.imageUrl}">
      </div>
      <div class="card-content">
        <span class="card-title activator grey-text text-darken-4">${
          post.title
        }<i class="material-icons right">more_vert</i></span>
        <p>Author: ${post.authorId}, Tags: ${
      post.tags ? post.tags.join(", ") : "no tags"
    }</p>
      </div>
      <div class="card-reveal">
        <span class="card-title grey-text text-darken-4">${
          post.title
        }<i class="material-icons right">close</i></span>
        <p>${post.content}</p>
      </div>
      <div class="card-action">
        <button class="btn waves-effect waves-light" type="button" id="edit${
          post.id
        }">Edit
          <i class="material-icons right">send</i>
        </button>
        <button class="btn waves-effect waves-light red lighten-1" type="button" id="delete${
          post.id
        }">Delete
          <i class="material-icons right">clear</i>
        </button>
      </div>
      </div>
      `;
    postElem
      .querySelector(`#delete${post.id}`)!
      .addEventListener("click", (event) => this.deletePost(post.id!));
    postElem
      .querySelector(`#edit${post.id}`)!
      .addEventListener("click", (event) => this.editPost(post));
  }

  editPost(post: Post) {
    this.fillPostForm(post);
    window.scrollTo(0, 0);
    AppStateStore.editedPost = post;
  }

  fillPostForm(post: Post) {
    let field: keyof Post;
    for (field in post) {
      (document.getElementById(field) as HTMLFormElement).value = post[field];
      const label = document.querySelector(
        `#add-post-form label[for=${field}]`
      );
      if (label) {
        label.className = "active";
      }
    }
  }

  handleSubmitPost = async (event: SubmitEvent) => {
    try {
      event.preventDefault();
      const post = this.getPostFormSnapshot();
      // const post = newPost as unknown as Post;
      if (post.id) {
        const updated = await BlogsAPI.updatePost(post);
        this.updatePostDOM(updated);
        AppStateStore.editedPost = undefined;
      } else {
        const created = await BlogsAPI.addNewPost(post);
        this.addPostDOM(created);
      }
      this.resetForm();
    } catch (err) {
      this.showError(err);
    }
  };

  getPostFormSnapshot(): Post {
    const formData = new FormData(this.addPostForm);
    const np: FormFieldDict<string> = {};
    formData.forEach((value, key) => {
      np[key] = value.toString();
    });
    return new Post(
      np.title,
      np.content,
      np.tags.split(/\W+/),
      np.imageUrl,
      parseInt(np.authorId),
      parseInt(np.id)
    );
  }

  resetForm = () => {
    if (AppStateStore.editedPost) {
      this.fillPostForm(AppStateStore.editedPost);
    } else {
      this.addPostForm.reset();
    }
  };

  async deletePost(postId: IdType) {
    try {
      await BlogsAPI.deletePostById(postId);
      document.getElementById(postId!.toString())?.remove();
    } catch (err) {
      this.showError(err);
    }
  }

  validateForm = (event: Event) => {
    const validationResult: ValidationResult<Post> = {};
    const config = AppStateStore.postFormValidationConfig;
    const formSnapshot = this.getPostFormSnapshot();
    let field: keyof ValidationConfig<Post>;
    for (field in config) {
      const validator = config[field];
      const validationErrors: string[] = [];
      if (validator !== undefined) {
        if (Array.isArray(validator)) {
          // Type guard
          validator.forEach((rule) => {
            try {
              const snap = formSnapshot[field]; // it must be separated in a constant otherwise the ternary operator does not work
              rule(snap ? snap.toString() : "", field); //When snap is NaN for number fields(empty) it will become empty string
            } catch (err) {
              validationErrors.push(err as string);
            }
          });
          if (validationErrors.length > 0) {  //Add all validation errors from the forEach loop
            validationResult[field] = validationErrors;
          }
        } else {
          try {
            validator(formSnapshot[field]!.toString(), field);
          } catch (err) {
            validationResult[field] = [err as string];
          }
        }
      }
    }
    this.showValidationErrors(validationResult);
  };

  showValidationErrors(validationResult: ValidationResult<Post>) {
    AppStateStore.postFormErrors = [];
    let field: keyof ValidationResult<Post>;
    for (field in validationResult) {
      const fieldError = `${field}Error`;
      console.log(fieldError);
      const filedErrors = validationResult[field];
      if (filedErrors !== undefined) {
        for (const err of filedErrors) {
          AppStateStore.postFormErrors.push(`${field} -> ${err}<br>`);
          document.getElementById(fieldError)!.innerHTML += (`<div>${field} -> ${err}<br></div>`);
        }
        
      }
    }
    this.showError(AppStateStore.postFormErrors.join('')); // default is ,
  }
}

const blogsController = new BlogsController();

blogsController.init();
