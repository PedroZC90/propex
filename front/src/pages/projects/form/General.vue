<template>
    <q-form ref="form-general" @submit="submit" @reset="reset">
        <div class="fields">
            <q-input class="field" :label="$t('project.title')"
                v-model="project.title"
                type="text"
                lazy-rules :rules="[ requiredInput ]"
                :disable="!$store.getters['authentication/isAdmin']"
                autofocus dense filled square />

            <q-input class="field" :label="$t('project.program')"
                v-model="project.program"
                type="text"
                lazy-rules :rules="[ requiredInput ]"
                :disable="!$store.getters['authentication/isAdmin']"
                dense filled square />

            <q-input class="field" :label="$t('project.startSeason')"
                v-model="project.startSeason"
                type="text"
                lazy-rules :rules="[ requiredInput ]"
                dense filled square />

            <q-input class="field" :label="$t('project.includedCourses')"
                v-model="project.includedCourses"
                type="text"
                lazy-rules :rules="[ requiredInput ]"
                dense filled square />

            <q-input class="field" :label="$t('project.ppcAndCourseCalendar')"
                v-model="project.ppcAndCourseCalendar"
                type="text"
                lazy-rules :rules="[ requiredInput ]"
                dense filled square />

            <q-input class="field" :label="$t('project.requiredCoursesCredits')"
                v-model="project.requiredCoursesCredits"
                type="text"
                dense filled square />

            <q-input class="field" :label="$t('project.infrastructure')"
                v-model="project.infrastructure"
                type="textarea"
                dense filled square />

            <q-input class="field" :label="$t('project.publicParticipation')"
                v-model="project.publicParticipation"
                type="textarea"
                dense filled square />

            <q-input class="field" :label="$t('project.accompanimentAndEvaluation')"
                v-model="project.accompanimentAndEvaluation"
                type="textarea"
                dense filled square />
        </div>
        <div class="grid">
            <!-- <q-space /> -->
            <q-btn class="box" color="grey-4" :label="$t('buttons.reset')" @click="reset" unelevated/>
            <q-btn class="box" color="primary" :label="$t('buttons.save')" @click="submit" unelevated/>
        </div>
    </q-form>
</template>

<script lang="ts">
import General from "./GeneralCtrl";
export default General;
</script>

<style lang="scss" scoped>
$spacing: 16px;

.fields {
    & > * {
        margin-bottom: $spacing;
    }
}

.grid {
    display: grid;
    gap: $spacing;
    grid-template-columns: repeat(2, 1fr);

    .box {
        width: 100%;
        border-radius: 0;
    }
}
</style>
