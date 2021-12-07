firebase use teamtasic-production
ionic build --prod
firebase deploy --except functions
firebase use testing
