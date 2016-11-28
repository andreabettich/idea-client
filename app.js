const API_ENDPOINT = "http://localhost:8000";

toastr.options.timeOut = 600; // How long the toast will display without user interaction

var App = new Vue({

    el: '#ideas',

    data: {
        idea: {
            title: '',
            slug: '',
            description: '',
            meta: {
                downvotes: 0,
                upvotes: 0
            }
        },
        ideas: []
    },

    mounted: function() {
        console.log("Idea Board Created");
        this.loadIdeas();
    },

    methods: {
        loadIdeas: function() {
            this.$http.get(API_ENDPOINT + '/api/idea').then(function(response) {
                this.$set(this, 'ideas', response.body.ideas);
                toastr.info('Ideas loaded');
            }, function(response) {
                // error callback
                console.log(response);
            });

        },
        upvoteIdea: function(index) {
            let itemSlug = this.ideas[index].slug;
            this.$http.get(API_ENDPOINT + '/api/idea/' + itemSlug + '/upvote').then(function(response) {
                this.$set(this.ideas, index, response.body.idea);
                toastr.success('Idea ' + this.ideas[index].title + ' upvoted');

            }.bind(this), function(response) {
                // error callback
                console.log(response);
            });
        },
        downvoteIdea: function(index) {
            let itemSlug = this.ideas[index].slug;
            this.$http.get(API_ENDPOINT + '/api/idea/' + itemSlug + '/downvote').then(function(response) {
                this.$set(this.ideas, index, response.body.idea);
                toastr.success('Idea ' + this.ideas[index].title + ' downvoted');

            }.bind(this), function(response) {
                // error callback
                console.log(response);
            });
        },
        addIdea: function() {
            if (this.idea.title) {
                this.$http.post(API_ENDPOINT + '/api/idea', this.idea, {emulateJSON: true}).then(function(response) {
                    this.ideas.push(response.body.idea);
                    toastr.success('Idea ' + response.body.idea.title + ' created. Huray!');

                }.bind(this), function(response) {
                    // error callback
                    console.log(response);
                });
                this.idea = {
                    title: '',
                    slug: '',
                    description: '',
                    meta: {
                        downvotes: 0,
                        upvotes: 0
                    }
                }
            }
        },
        createSlug: function() {
            this.idea.slug = this.idea.title.toString().toLowerCase().replace(/\s+/g, '-'). // Replace spaces with -
            replace(/[^\w\-]+/g, ''). // Remove all non-word chars
            replace(/\-\-+/g, '-'). // Replace multiple - with single -
            replace(/^-+/, ''). // Trim - from start of text
            replace(/-+$/, ''); // Trim - from end of text
        }
    }
});
