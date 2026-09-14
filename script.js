// Portfolio Item Class
class PortfolioItem {
    constructor(data) {
        this.id = Date.now();
        this.name = data.name;
        this.title = data.title;
        this.email = data.email;
        this.projectTitle = data.projectTitle;
        this.description = data.description;
        this.technologies = data.technologies;
        this.liveLink = data.liveLink;
        this.githubLink = data.githubLink;
        this.imageUrl = data.imageUrl;
        this.duration = data.duration;
        this.highlights = data.highlights;
    }
}

// Portfolio Manager Class
class PortfolioManager {
    constructor() {
        this.items = this.loadFromLocalStorage();
        this.form = document.getElementById('portfolioForm');
        this.cardsContainer = document.getElementById('cardsContainer');
        
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            title: document.getElementById('title').value,
            email: document.getElementById('email').value,
            projectTitle: document.getElementById('projectTitle').value,
            description: document.getElementById('description').value,
            technologies: document.getElementById('technologies').value,
            liveLink: document.getElementById('liveLink').value,
            githubLink: document.getElementById('githubLink').value,
            imageUrl: document.getElementById('imageUrl').value,
            duration: document.getElementById('duration').value,
            highlights: document.getElementById('highlights').value,
        };

        const portfolioItem = new PortfolioItem(formData);
        this.items.push(portfolioItem);
        this.saveToLocalStorage();
        this.form.reset();
        this.render();

        // Show success message
        this.showNotification('Portfolio item added successfully!');
    }

    deleteItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.saveToLocalStorage();
        this.render();
        this.showNotification('Portfolio item deleted!');
    }

    render() {
        if (this.items.length === 0) {
            this.cardsContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📋</div>
                    <p>No portfolio items yet. Add one to get started!</p>
                </div>
            `;
            return;
        }

        this.cardsContainer.innerHTML = this.items
            .map(item => this.createCard(item))
            .join('');

        // Add delete event listeners
        document.querySelectorAll('.card-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                if (confirm('Are you sure you want to delete this item?')) {
                    this.deleteItem(id);
                }
            });
        });
    }

    createCard(item) {
        const initials = item.name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);

        const techArray = item.technologies
            .split(',')
            .map(tech => tech.trim())
            .filter(tech => tech);

        const techTagsHtml = techArray
            .map(tech => `<span class="tech-tag">${this.escapeHtml(tech)}</span>`)
            .join('');

        const githubLinkHtml = item.githubLink
            ? `<a href="${item.githubLink}" target="_blank" rel="noopener noreferrer" class="card-link github">GitHub</a>`
            : '';

        return `
            <div class="portfolio-card" data-id="${item.id}">
                <img src="${this.escapeHtml(item.imageUrl)}" alt="Project Image" class="card-image" onerror="this.style.background='linear-gradient(135deg, #667eea 0%, #764ba2 100%)'; this.style.content=''; this.alt='Project Image';">
                
                <div class="card-content">
                    <div>
                        <div class="card-header">
                            <div class="card-user-info">
                                <div class="card-user-avatar">${initials}</div>
                                <div class="card-user-details">
                                    <h3>${this.escapeHtml(item.name)}</h3>
                                    <p>${this.escapeHtml(item.title)}</p>
                                </div>
                            </div>
                            <div class="card-project-title">${this.escapeHtml(item.projectTitle)}</div>
                            <div class="card-duration">📅 ${this.escapeHtml(item.duration)}</div>
                        </div>

                        <div class="card-body">
                            <p class="card-description">${this.escapeHtml(item.description)}</p>

                            <div class="card-technologies">
                                <span class="tech-label">🛠️ Technologies</span>
                                <div class="tech-tags">
                                    ${techTagsHtml}
                                </div>
                            </div>

                            ${item.highlights ? `
                                <div class="card-highlights">
                                    <span class="highlights-label">✨ Highlights</span>
                                    <div class="highlights-list">${this.escapeHtml(item.highlights)}</div>
                                </div>
                            ` : ''}
                        </div>
                    </div>

                    <div class="card-footer">
                        <a href="${item.liveLink}" target="_blank" rel="noopener noreferrer" class="card-link">🌐 Live</a>
                        ${githubLinkHtml}
                        <button class="card-delete" data-id="${item.id}">🗑️ Delete</button>
                    </div>
                </div>
            </div>
        `;
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
            font-weight: 500;
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    saveToLocalStorage() {
        localStorage.setItem('portfolioItems', JSON.stringify(this.items));
    }

    loadFromLocalStorage() {
        const data = localStorage.getItem('portfolioItems');
        return data ? JSON.parse(data) : [];
    }
}

// Add animation styles for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(30px);
        }
    }
`;
document.head.appendChild(style);

// Initialize Portfolio Manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioManager();
});
