<p align="center">
  <img src="public/Linkredibles-logo.png" alt="Linkredibles" width="280">
</p>

<p align="center">
  A curated directory of interesting open-source projects, tools, and resources.
</p>
<p align="center">
Linkredibles helps people discover useful open-source projects in one place.
</p>
<p align="center">
Projects are submitted through GitHub Issues, reviewed by the Linkredibles team, automatically validated, and added to the directory after approval.
</p>
---

## 🚀 Submit a Project

Have an open-source project you'd like to share?

You can submit it through the **Project Submission** form:

👉 **[Submit your project](https://github.com/linkredibles/linkredibles/issues/new?template=project-submission.yml)**

Before submitting, make sure your project meets the requirements below.

---

## ✅ Submission Requirements

Your project must:

- Be hosted on **GitHub**
- Have a **public GitHub repository**
- Be an actual repository, not a GitHub organization, user profile, or collection page
- Be open source
- Have a clear project name
- Have a meaningful project description
- Have a valid GitHub repository URL
- Not already exist in the Linkredibles directory

### Examples

✅ Valid:

```text
https://github.com/owner/project
```

❌ Not valid:

```text
https://github.com/owner
```

The second example points to a GitHub profile or organization rather than a repository.

### Public repositories only

Private repositories cannot be submitted.

The automated submission system checks whether the repository is publicly accessible before creating a project entry.

---

## 📝 How to Submit

### 1. Open the submission form

Go to:

**[Submit a project](https://github.com/linkredibles/linkredibles/issues/new?template=project-submission.yml)**

GitHub will open the project submission form.

### 2. Complete all required fields

Provide:

| Field | What to enter |
|---|---|
| **Project name** | The name you want displayed in the directory |
| **GitHub repository** | The full public GitHub repository URL |
| **Project website** | Your project's website, documentation, or demo, if available |
| **Project description** | A clear explanation of what the project does |
| **Why is it interesting?** | What makes the project useful, unusual, or worth discovering |
| **Category** | Select the category that best describes the project |
| **Tags** | Add relevant comma-separated tags |

### 3. Confirm your submission

The submission form includes a confirmation that the repository is open source and public.

Please only confirm this if it is actually true.

### 4. Submit the issue

Click **Submit new issue**.

Your submission will then be available to the Linkredibles maintainers for review.

---

## 🔍 What Happens After Submission?

The submission process is automated.

### Step 1 — Review

A Linkredibles maintainer reviews the submission.

### Step 2 — Approval

If the submission is approved, the issue receives the `approved` label.

### Step 3 — Automated validation

GitHub Actions processes the approved submission and checks the repository information.

The system verifies that:

- The GitHub URL points to a repository
- The repository is publicly accessible
- The submitted project can be represented as a valid directory entry
- The project does not create an invalid or duplicate directory entry

### Step 4 — Pull request

If the submission passes the initial checks, Linkredibles automatically creates a pull request containing the project entry.

The generated file is placed in:

```text
content/projects/
```

For example:

```text
content/projects/my-project.json
```

### Step 5 — Content validation

The pull request is automatically checked by the Linkredibles content validation workflow.

This verifies the directory content before it can be merged.

### Step 6 — Merge

After review and successful validation, the pull request can be merged.

The project then becomes part of the Linkredibles directory.

---

## ⚠️ Common Submission Problems

### "GitHub URL must point to a repository"

Make sure you submit a repository URL:

```text
https://github.com/owner/project
```

rather than:

```text
https://github.com/owner
```

---

### "Repository is private or cannot be accessed"

Your repository must be public.

Check your GitHub repository settings under:

**Settings → General → Danger Zone → Change repository visibility**

The repository must be accessible without private-repository permissions.

---

### "Duplicate GitHub repository"

The repository may already be listed in Linkredibles.

Search the directory before submitting to make sure the project isn't already present.

---

### Validation fails

If the automated validation fails, the pull request will not be ready to merge.

Maintainers can inspect the validation result and determine what needs to be corrected.

Do not repeatedly submit the same project to work around a validation error.

---

## 📂 Repository Structure

The main directory content is stored under:

```text
content/
└── projects/
    ├── project-one.json
    ├── project-two.json
    └── ...
```

Each project is represented by a JSON file.

The repository also contains the automation used to process and validate submissions:

```text
.github/
└── workflows/

scripts/
├── create-project-from-issue.ts
└── validate-content.ts
```

---

## 🛠️ Contributing

There are two main ways to contribute:

### Submit a project

Use the project submission form:

👉 **[Submit a project](https://github.com/linkredibles/linkredibles/issues/new?template=project-submission.yml)**

### Contribute to Linkredibles

For changes to the directory, website, validation system, or automation, open an issue or pull request in this repository.

👉 **[Open an issue](https://github.com/linkredibles/linkredibles/issues/new)**

👉 **[View existing issues](https://github.com/linkredibles/linkredibles/issues)**

---

## 🔗 Useful Links

- 🏠 **[Linkredibles repository](https://github.com/linkredibles/linkredibles)**
- ➕ **[Submit a project](https://github.com/linkredibles/linkredibles/issues/new?template=project-submission.yml)**
- 🐛 **[Report a problem](https://github.com/linkredibles/linkredibles/issues/new)**
- 📋 **[View issues](https://github.com/linkredibles/linkredibles/issues)**
- 🔀 **[View pull requests](https://github.com/linkredibles/linkredibles/pulls)**
- 📁 **[Browse project entries](https://github.com/linkredibles/linkredibles/tree/main/content/projects)**
- ⚙️ **[GitHub Actions](https://github.com/linkredibles/linkredibles/actions)**

---

## 📜 License

See the repository license for information about using and contributing to Linkredibles.
