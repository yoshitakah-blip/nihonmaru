const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    // Reveal animations
    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form Tab Switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const forms = document.querySelectorAll('.contact-forms form');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // Toggle buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Toggle forms
            forms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${targetTab}-form`) {
                    form.classList.add('active');
                }
            });
        });
    });

    // Form Submission
    const allForms = document.querySelectorAll('form');
    allForms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerText;

            btn.disabled = true;
            btn.innerText = '送信中...';

            const formData = new FormData(form);

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    alert('ありがとうございます。メッセージは送信されました。内容を確認次第、担当者よりご連絡いたします。\n\n※初回送信の場合、確認メールが届くことがあります。お手元に届きましたら承認をお願いいたします。');
                    form.reset();
                } else {
                    throw new Error('送信に失敗しました。');
                }
            } catch (error) {
                console.error('Submission error:', error);
                alert('申し訳ありませんが、送信中にエラーが発生しました。時間をおいて再度お試しいただくか、お電話にてお問い合わせください。');
            } finally {
                btn.disabled = false;
                btn.innerText = originalText;
            }
        });
    });
});
