# Ground and Net Specs Enhancement TODO

## Current Status
- ✅ Plan created and approved
- 🔄 Implementing enhanced ground and net specifications

## Tasks
- [x] Update Ground.java entity with detailed specifications
- [x] Create database migration for ground specs
- [ ] Enhance Ground creation/edit modal in Admin.tsx with collapsible sections
- [ ] Add image upload functionality to Ground creation modal
- [ ] Add image upload functionality to Net creation modal (if missing)
- [ ] Integrate auto-suggestions for ground specs
- [ ] Update suggestionService.ts with ground-related suggestions
- [ ] Add chat box definitions for ground specs
- [ ] Test ground creation functionality
- [ ] Test net creation with image upload
- [ ] Verify auto-suggestions work for both grounds and nets

## Categories to Add for Grounds
1. Basic Ground Specs
2. Cricket Specs
3. Facilities
4. Specs
5. Image Upload

## Categories to Add for Nets (already partially implemented)
1. Enhanced specs matching ground structure
2. Image upload (if missing)
3. Improved auto-suggestions

## Chat Box Implementation
- Small popup with definition text
- Position near clicked heading
- Close on outside click
- Add definitions for all ground and net specifications

## Auto-suggestions
- Title suggestions based on existing facilities
- Description line suggestions
- Feature word suggestions
- Integrate with existing suggestionService.ts
