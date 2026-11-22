### Task 11: Contact Section + Footer

**Files:**
- Create: `src/components/Contact.astro`
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Create Contact.astro**

```astro
<section id="contact" class="section">
  <div class="container">
    <div class="section-title" data-i18n="contact.title">Contact</div>
    <div class="section-subtitle" data-i18n="contact.subtitle">Let's Connect</div>
    <div class="contact-grid">
      <div class="contact-form fade-in">
        <input type="text" class="input" data-i18n-placeholder="contact.name" placeholder="Name" />
        <input type="email" class="input" data-i18n-placeholder="contact.email" placeholder="Email" />
        <textarea class="input textarea" rows="5" data-i18n-placeholder="contact.message" placeholder="Message"></textarea>
        <button class="btn btn-primary" data-i18n="contact.send">Send Message</button>
      </div>
      <div class="contact-info fade-in">
        <h3 class="contact-info-title" data-i18n="contact.info_title">Contact Info</h3>
        <div class="contact-item">
          <strong>Email:</strong>
          <span data-i18n="contact.email_addr"></span>
        </div>
        <div class="contact-item">
          <strong>Phone:</strong>
          <span data-i18n="contact.phone"></span>
        </div>
        <div class="contact-item">
          <strong>Location:</strong>
          <span data-i18n="contact.location"></span>
        </div>
        <h3 class="contact-ref-title" data-i18n="contact.ref_title">References</h3>
        <div class="contact-item">
          <span data-i18n="contact.ref1"></span><br/>
          <small data-i18n="contact.ref1_phone"></small>
        </div>
        <div class="contact-item">
          <span data-i18n="contact.ref2"></span><br/>
          <small data-i18n="contact.ref2_phone"></small>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .contact-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
  }

  .contact-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .input {
    padding: 0.75rem 1rem;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    font-family: var(--font-sans);
    font-size: 0.95rem;
    background: var(--bg);
    color: var(--text);
    transition: border-color 0.2s;
  }

  .input:focus {
    outline: none;
    border-color: var(--accent);
  }

  .textarea {
    resize: vertical;
    min-height: 120px;
  }

  .contact-info-title, .contact-ref-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--primary);
    margin-bottom: 1rem;
  }

  .contact-ref-title {
    margin-top: 2rem;
  }

  .contact-item {
    margin-bottom: 0.75rem;
    font-size: 0.9rem;
    color: var(--text);
  }

  .contact-item small {
    color: var(--text-muted);
  }

  @media (max-width: 768px) {
    .contact-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 2: Create Footer.astro**

```astro
<footer class="footer">
  <div class="container">
    <div class="footer-inner">
      <p data-i18n="footer.copyright">&copy; 2024 Mardiansyah Gunting. All rights reserved.</p>
      <div class="footer-links">
        <a href="https://github.com/mardiansyah-gunting" target="_blank" rel="noopener noreferrer">GitHub</a>
      </div>
    </div>
  </div>
</footer>

<style>
  .footer {
    border-top: 1px solid var(--border);
    padding: 2rem 0;
  }

  .footer-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.85rem;
    color: var(--text-muted);
  }

  .footer-links {
    display: flex;
    gap: 1rem;
  }

  .footer-links a {
    color: var(--text-muted);
  }

  .footer-links a:hover {
    color: var(--accent);
  }

  @media (max-width: 768px) {
    .footer-inner {
      flex-direction: column;
      gap: 0.5rem;
      text-align: center;
    }
  }
</style>
```

